'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Plus,
  ClipboardCheck,
  XCircle,
  Package,
  Printer,
  History
} from 'lucide-react'

// Import GRN Modals
import {
  CreateGRNModal,
  QualityInspectionModal,
  AcceptRejectGRNModal,
  PostToInventoryModal,
  ViewGRNDetailsModal,
  EditGRNModal,
  PrintGRNModal,
  ExportGRNsModal,
  GRNHistoryModal,
  type GRNData
} from '@/components/procurement/GRNModals'

interface GRN {
  id: string
  grnNumber: string
  poNumber: string
  vendorName: string
  receiptDate: string
  itemsCount: number
  orderedQty: number
  receivedQty: number
  acceptedQty: number
  rejectedQty: number
  invoiceValue: number
  status: 'draft' | 'under_inspection' | 'partially_accepted' | 'accepted' | 'rejected'
  inspector: string
  inspectionDate?: string
  qualityStatus: 'passed' | 'failed' | 'pending'
  discrepancyNotes?: string
  createdBy: string
}

const mockGRNs: GRN[] = [
  {
    id: '1',
    grnNumber: 'GRN-2025-001',
    poNumber: 'PO-2025-045',
    vendorName: 'Tata Steel Ltd',
    receiptDate: '2025-01-15',
    itemsCount: 5,
    orderedQty: 1000,
    receivedQty: 950,
    acceptedQty: 920,
    rejectedQty: 30,
    invoiceValue: 825000,
    status: 'partially_accepted',
    inspector: 'Suresh Reddy',
    inspectionDate: '2025-01-15',
    qualityStatus: 'passed',
    discrepancyNotes: '50 units short delivery, 30 units failed quality check',
    createdBy: 'Rajesh Kumar'
  },
  {
    id: '2',
    grnNumber: 'GRN-2025-002',
    poNumber: 'PO-2025-042',
    vendorName: 'Bosch Rexroth India',
    receiptDate: '2025-01-14',
    itemsCount: 3,
    orderedQty: 150,
    receivedQty: 150,
    acceptedQty: 150,
    rejectedQty: 0,
    invoiceValue: 315000,
    status: 'accepted',
    inspector: 'Anita Desai',
    inspectionDate: '2025-01-14',
    qualityStatus: 'passed',
    createdBy: 'Priya Patel'
  },
  {
    id: '3',
    grnNumber: 'GRN-2025-003',
    poNumber: 'PO-2025-038',
    vendorName: 'Hindustan Petroleum',
    receiptDate: '2025-01-13',
    itemsCount: 8,
    orderedQty: 500,
    receivedQty: 500,
    acceptedQty: 0,
    rejectedQty: 0,
    invoiceValue: 165000,
    status: 'under_inspection',
    inspector: 'Suresh Reddy',
    qualityStatus: 'pending',
    createdBy: 'Karthik Iyer'
  },
  {
    id: '4',
    grnNumber: 'GRN-2025-004',
    poNumber: 'PO-2025-041',
    vendorName: 'SKF India',
    receiptDate: '2025-01-12',
    itemsCount: 12,
    orderedQty: 800,
    receivedQty: 800,
    acceptedQty: 750,
    rejectedQty: 50,
    invoiceValue: 275000,
    status: 'partially_accepted',
    inspector: 'Anita Desai',
    inspectionDate: '2025-01-13',
    qualityStatus: 'passed',
    discrepancyNotes: '50 units damaged during transit',
    createdBy: 'Meena Nair'
  },
  {
    id: '5',
    grnNumber: 'GRN-2025-005',
    poNumber: 'PO-2025-035',
    vendorName: 'Parker Hannifin',
    receiptDate: '2025-01-11',
    itemsCount: 6,
    orderedQty: 200,
    receivedQty: 180,
    acceptedQty: 0,
    rejectedQty: 180,
    invoiceValue: 95000,
    status: 'rejected',
    inspector: 'Suresh Reddy',
    inspectionDate: '2025-01-12',
    qualityStatus: 'failed',
    discrepancyNotes: 'All units failed quality inspection - wrong specifications',
    createdBy: 'Rajesh Kumar'
  },
  {
    id: '6',
    grnNumber: 'GRN-2025-006',
    poNumber: 'PO-2025-047',
    vendorName: 'Blue Star',
    receiptDate: '2025-01-17',
    itemsCount: 4,
    orderedQty: 350,
    receivedQty: 0,
    acceptedQty: 0,
    rejectedQty: 0,
    invoiceValue: 425000,
    status: 'draft',
    inspector: '-',
    qualityStatus: 'pending',
    createdBy: 'Suresh Reddy'
  },
]

export default function ProcurementGRNPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vendorFilter, setVendorFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Modal state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false)
  const [isAcceptRejectModalOpen, setIsAcceptRejectModalOpen] = useState(false)
  const [isPostToInventoryModalOpen, setIsPostToInventoryModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedGRN, setSelectedGRN] = useState<GRN | null>(null)

  const filteredGRNs = mockGRNs.filter(grn => {
    const matchesSearch = grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grn.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grn.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || grn.status === statusFilter
    const matchesVendor = vendorFilter === 'all' || grn.vendorName === vendorFilter
    return matchesSearch && matchesStatus && matchesVendor
  })

  const totalPages = Math.ceil(filteredGRNs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedGRNs = filteredGRNs.slice(startIndex, startIndex + itemsPerPage)

  const uniqueVendors = Array.from(new Set(mockGRNs.map(grn => grn.vendorName))).sort()

  const today = new Date().toISOString().split('T')[0]
  const stats = {
    pendingInspection: mockGRNs.filter(g => g.status === 'under_inspection').length,
    approvedToday: mockGRNs.filter(g => g.status === 'accepted' && g.inspectionDate === today).length,
    rejected: mockGRNs.filter(g => g.status === 'rejected').length,
    totalValueReceived: mockGRNs.filter(g => g.status === 'accepted' || g.status === 'partially_accepted').reduce((sum, g) => sum + g.invoiceValue, 0)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800 border-gray-300',
      under_inspection: 'bg-blue-100 text-blue-800 border-blue-300',
      partially_accepted: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      accepted: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    }
    return badges[status as keyof typeof badges] || badges.draft
  }

  const getQualityBadge = (quality: string) => {
    const badges = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800'
    }
    return badges[quality as keyof typeof badges] || badges.pending
  }

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Modal handlers
  const handleView = (id: string) => {
    const grn = mockGRNs.find(g => g.id === id)
    if (grn) {
      setSelectedGRN(grn)
      setIsViewModalOpen(true)
    }
  }

  const handleEdit = (id: string) => {
    const grn = mockGRNs.find(g => g.id === id)
    if (grn) {
      setSelectedGRN(grn)
      setIsEditModalOpen(true)
    }
  }

  const handleInspection = (id: string) => {
    const grn = mockGRNs.find(g => g.id === id)
    if (grn) {
      setSelectedGRN(grn)
      setIsInspectionModalOpen(true)
    }
  }

  const handleAcceptReject = (id: string) => {
    const grn = mockGRNs.find(g => g.id === id)
    if (grn) {
      setSelectedGRN(grn)
      setIsAcceptRejectModalOpen(true)
    }
  }

  const handlePostToInventory = (id: string) => {
    const grn = mockGRNs.find(g => g.id === id)
    if (grn) {
      setSelectedGRN(grn)
      setIsPostToInventoryModalOpen(true)
    }
  }

  const handlePrint = (id: string) => {
    const grn = mockGRNs.find(g => g.id === id)
    if (grn) {
      setSelectedGRN(grn)
      setIsPrintModalOpen(true)
    }
  }

  const handleHistory = (id: string) => {
    const grn = mockGRNs.find(g => g.id === id)
    if (grn) {
      setSelectedGRN(grn)
      setIsHistoryModalOpen(true)
    }
  }

  const handleExport = () => {
    setIsExportModalOpen(true)
  }

  const handleCreateGRN = () => {
    setIsCreateModalOpen(true)
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Pending Inspection</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.pendingInspection}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.approvedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Rejected</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{stats.rejected}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Value Received</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{formatCurrency(stats.totalValueReceived)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by GRN number, PO number, or vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="under_inspection">Under Inspection</option>
                  <option value="partially_accepted">Partially Accepted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={vendorFilter}
                  onChange={(e) => setVendorFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
                >
                  <option value="all">All Vendors</option>
                  {uniqueVendors.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreateGRN}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl font-medium"
              >
                <Plus className="w-4 h-4" />
                Create GRN
              </button>
              <button
                onClick={handleExport}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl font-medium"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* GRN Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-24rem)]">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    GRN Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Receipt Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Items Count
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ordered/Received/Accepted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Rejected Qty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Invoice Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Inspector
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedGRNs.map((grn) => (
                  <tr key={grn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-semibold text-gray-900">{grn.grnNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{grn.poNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{grn.vendorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{grn.receiptDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 text-center">{grn.itemsCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">{grn.orderedQty}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-blue-600 font-medium">{grn.receivedQty}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-green-600 font-semibold">{grn.acceptedQty}</span>
                        </div>
                        {grn.discrepancyNotes && (
                          <div className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Discrepancy
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold text-center ${grn.rejectedQty > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {grn.rejectedQty}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatCurrency(grn.invoiceValue)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(grn.status)}`}>
                          {formatStatus(grn.status)}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${getQualityBadge(grn.qualityStatus)}`}>
                            QC: {grn.qualityStatus.charAt(0).toUpperCase() + grn.qualityStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{grn.inspector}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(grn.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(grn.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit GRN"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {grn.status === 'under_inspection' && (
                          <button
                            onClick={() => handleInspection(grn.id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Quality Inspection"
                          >
                            <ClipboardCheck className="w-4 h-4" />
                          </button>
                        )}
                        {(grn.status === 'under_inspection' || grn.status === 'partially_accepted') && (
                          <button
                            onClick={() => handleAcceptReject(grn.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Accept/Reject"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(grn.status === 'accepted' || grn.status === 'partially_accepted') && (
                          <button
                            onClick={() => handlePostToInventory(grn.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Post to Inventory"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handlePrint(grn.id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Print GRN"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleHistory(grn.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="View History"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filteredGRNs.length)}</span> of{' '}
                <span className="font-semibold">{filteredGRNs.length}</span> GRNs
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRN Modals */}
      <CreateGRNModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          console.log('Creating GRN:', data)
          setIsCreateModalOpen(false)
        }}
      />

      <ViewGRNDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        grn={selectedGRN ? {
          id: selectedGRN.id,
          grnNumber: selectedGRN.grnNumber,
          poNumber: selectedGRN.poNumber,
          vendorName: selectedGRN.vendorName,
          receiptDate: selectedGRN.receiptDate,
          itemsCount: selectedGRN.itemsCount,
          orderedQty: selectedGRN.orderedQty,
          receivedQty: selectedGRN.receivedQty,
          acceptedQty: selectedGRN.acceptedQty,
          rejectedQty: selectedGRN.rejectedQty,
          invoiceValue: selectedGRN.invoiceValue,
          status: selectedGRN.status,
          inspector: selectedGRN.inspector,
          inspectionDate: selectedGRN.inspectionDate,
          qualityStatus: selectedGRN.qualityStatus,
          discrepancyNotes: selectedGRN.discrepancyNotes
        } : undefined}
      />

      <EditGRNModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        grn={selectedGRN ? {
          id: selectedGRN.id,
          grnNumber: selectedGRN.grnNumber,
          poNumber: selectedGRN.poNumber,
          vendorName: selectedGRN.vendorName,
          receiptDate: selectedGRN.receiptDate,
          itemsCount: selectedGRN.itemsCount,
          orderedQty: selectedGRN.orderedQty,
          receivedQty: selectedGRN.receivedQty,
          acceptedQty: selectedGRN.acceptedQty,
          rejectedQty: selectedGRN.rejectedQty,
          invoiceValue: selectedGRN.invoiceValue,
          status: selectedGRN.status,
          inspector: selectedGRN.inspector,
          inspectionDate: selectedGRN.inspectionDate,
          qualityStatus: selectedGRN.qualityStatus,
          discrepancyNotes: selectedGRN.discrepancyNotes
        } : undefined}
        onSubmit={(data) => {
          console.log('Updating GRN:', data)
          setIsEditModalOpen(false)
        }}
      />

      <QualityInspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        grn={selectedGRN ? {
          id: selectedGRN.id,
          grnNumber: selectedGRN.grnNumber,
          poNumber: selectedGRN.poNumber,
          vendorName: selectedGRN.vendorName
        } : undefined}
        onSubmit={(data) => {
          console.log('Quality Inspection:', data)
          setIsInspectionModalOpen(false)
        }}
      />

      <AcceptRejectGRNModal
        isOpen={isAcceptRejectModalOpen}
        onClose={() => setIsAcceptRejectModalOpen(false)}
        grn={selectedGRN ? {
          id: selectedGRN.id,
          grnNumber: selectedGRN.grnNumber,
          poNumber: selectedGRN.poNumber,
          vendorName: selectedGRN.vendorName,
          receivedQty: selectedGRN.receivedQty,
          acceptedQty: selectedGRN.acceptedQty,
          rejectedQty: selectedGRN.rejectedQty
        } : undefined}
        onSubmit={(data) => {
          console.log('Accept/Reject GRN:', data)
          setIsAcceptRejectModalOpen(false)
        }}
      />

      <PostToInventoryModal
        isOpen={isPostToInventoryModalOpen}
        onClose={() => setIsPostToInventoryModalOpen(false)}
        grn={selectedGRN ? {
          id: selectedGRN.id,
          grnNumber: selectedGRN.grnNumber,
          poNumber: selectedGRN.poNumber,
          vendorName: selectedGRN.vendorName,
          acceptedQty: selectedGRN.acceptedQty
        } : undefined}
        onSubmit={(data) => {
          console.log('Posting to Inventory:', data)
          setIsPostToInventoryModalOpen(false)
        }}
      />

      <PrintGRNModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        grn={selectedGRN ? {
          id: selectedGRN.id,
          grnNumber: selectedGRN.grnNumber,
          poNumber: selectedGRN.poNumber,
          vendorName: selectedGRN.vendorName,
          receiptDate: selectedGRN.receiptDate,
          itemsCount: selectedGRN.itemsCount,
          orderedQty: selectedGRN.orderedQty,
          receivedQty: selectedGRN.receivedQty,
          acceptedQty: selectedGRN.acceptedQty,
          rejectedQty: selectedGRN.rejectedQty,
          invoiceValue: selectedGRN.invoiceValue,
          status: selectedGRN.status
        } : undefined}
        onPrint={(options) => {
          console.log('Printing GRN with options:', options)
          setIsPrintModalOpen(false)
        }}
      />

      <ExportGRNsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          console.log('Exporting GRNs with options:', options)
          setIsExportModalOpen(false)
        }}
      />

      <GRNHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        grn={selectedGRN ? {
          id: selectedGRN.id,
          grnNumber: selectedGRN.grnNumber,
          poNumber: selectedGRN.poNumber,
          vendorName: selectedGRN.vendorName
        } : undefined}
      />
    </div>
  )
}
