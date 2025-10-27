'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  Send,
  Eye,
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  FileText,
  Calendar,
  Clock,
  Building2,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Mail,
  MessageSquare,
  Users,
  Award,
  BarChart3,
  ArrowUpDown,
  Zap,
  Target,
  RefreshCw,
  Edit2,
  GitCompare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface RFQ {
  id: string
  rfqNumber: string
  title: string
  issueDate: string
  closingDate: string
  vendorsInvited: number
  quotesReceived: number
  category: 'raw_materials' | 'components' | 'services' | 'equipment' | 'consumables'
  estimatedValue: number
  status: 'draft' | 'issued' | 'quotes_received' | 'evaluated' | 'awarded' | 'cancelled'
  createdBy: string
  assignedTo: string
  description: string
  vendors: string[]
  responseTimeAvg?: number
}

const mockRFQs: RFQ[] = [
  {
    id: '1',
    rfqNumber: 'RFQ-2025-001',
    title: 'Mild Steel Sheets and Plates',
    issueDate: '2025-01-10',
    closingDate: '2025-01-20',
    vendorsInvited: 5,
    quotesReceived: 3,
    category: 'raw_materials',
    estimatedValue: 850000,
    status: 'quotes_received',
    createdBy: 'Rajesh Kumar',
    assignedTo: 'Amit Sharma',
    description: 'Various grades of mild steel sheets for production',
    vendors: ['Tata Steel Ltd', 'JSW Steel', 'SAIL'],
    responseTimeAvg: 6
  },
  {
    id: '2',
    rfqNumber: 'RFQ-2025-002',
    title: 'Hydraulic Cylinders and Components',
    issueDate: '2025-01-08',
    closingDate: '2025-01-18',
    vendorsInvited: 4,
    quotesReceived: 4,
    category: 'components',
    estimatedValue: 325000,
    status: 'evaluated',
    createdBy: 'Priya Patel',
    assignedTo: 'Vijay Singh',
    description: 'Hydraulic cylinders for assembly line',
    vendors: ['Bosch Rexroth India', 'Parker Hannifin', 'Eaton Hydraulics', 'Hydraulics India'],
    responseTimeAvg: 4
  },
  {
    id: '3',
    rfqNumber: 'RFQ-2025-003',
    title: 'Annual Maintenance Contract - HVAC Systems',
    issueDate: '2025-01-12',
    closingDate: '2025-01-25',
    vendorsInvited: 6,
    quotesReceived: 2,
    category: 'services',
    estimatedValue: 450000,
    status: 'issued',
    createdBy: 'Suresh Reddy',
    assignedTo: 'Amit Sharma',
    description: 'Comprehensive HVAC maintenance for facility',
    vendors: ['Blue Star', 'Voltas', 'Carrier Aircon', 'Daikin India', 'Johnson Controls', 'Hitachi India'],
    responseTimeAvg: 8
  },
  {
    id: '4',
    rfqNumber: 'RFQ-2025-004',
    title: 'CNC Milling Machine - 5 Axis',
    issueDate: '2025-01-05',
    closingDate: '2025-01-15',
    vendorsInvited: 3,
    quotesReceived: 3,
    category: 'equipment',
    estimatedValue: 2500000,
    status: 'awarded',
    createdBy: 'Anita Desai',
    assignedTo: 'Vijay Singh',
    description: 'High precision 5-axis CNC milling machine',
    vendors: ['DMG Mori India', 'Haas Automation', 'Makino India'],
    responseTimeAvg: 5
  },
  {
    id: '5',
    rfqNumber: 'RFQ-2025-005',
    title: 'Industrial Lubricants and Cutting Fluids',
    issueDate: '2025-01-14',
    closingDate: '2025-01-28',
    vendorsInvited: 5,
    quotesReceived: 0,
    category: 'consumables',
    estimatedValue: 175000,
    status: 'issued',
    createdBy: 'Karthik Iyer',
    assignedTo: 'Amit Sharma',
    description: 'Bulk procurement of lubricants and cutting fluids',
    vendors: ['Castrol India', 'Shell Lubricants', 'Hindustan Petroleum', 'Indian Oil', 'Bharat Petroleum'],
  },
  {
    id: '6',
    rfqNumber: 'RFQ-2025-006',
    title: 'Precision Ball Bearings',
    issueDate: '2025-01-03',
    closingDate: '2025-01-13',
    vendorsInvited: 4,
    quotesReceived: 2,
    category: 'components',
    estimatedValue: 285000,
    status: 'cancelled',
    createdBy: 'Meena Nair',
    assignedTo: 'Vijay Singh',
    description: 'High-grade precision ball bearings',
    vendors: ['SKF India', 'NTN Bearings', 'Timken India', 'FAG Bearings'],
    responseTimeAvg: 7
  },
]

export default function ProcurementRFQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredRFQs = mockRFQs.filter(rfq => {
    const matchesSearch = rfq.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || rfq.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalPages = Math.ceil(filteredRFQs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRFQs = filteredRFQs.slice(startIndex, startIndex + itemsPerPage)

  const stats = {
    openRFQs: mockRFQs.filter(r => r.status === 'issued').length,
    quotesReceived: mockRFQs.reduce((sum, r) => sum + r.quotesReceived, 0),
    awarded: mockRFQs.filter(r => r.status === 'awarded').length,
    avgResponseTime: Math.round(mockRFQs.filter(r => r.responseTimeAvg).reduce((sum, r) => sum + (r.responseTimeAvg || 0), 0) / mockRFQs.filter(r => r.responseTimeAvg).length)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800 border-gray-300',
      issued: 'bg-blue-100 text-blue-800 border-blue-300',
      quotes_received: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      evaluated: 'bg-purple-100 text-purple-800 border-purple-300',
      awarded: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    }
    return badges[status as keyof typeof badges] || badges.draft
  }

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const formatCategory = (category: string) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  const handleExport = () => {
    console.log('Exporting RFQ report...')
  }

  const handleView = (id: string) => {
    console.log('Viewing RFQ:', id)
  }

  const handleEdit = (id: string) => {
    console.log('Editing RFQ:', id)
  }

  const handleCompareQuotes = (id: string) => {
    console.log('Comparing quotes for RFQ:', id)
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Open RFQs</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.openRFQs}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Quotes Received</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.quotesReceived}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Awarded</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.awarded}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.avgResponseTime} days</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search by RFQ number, title, or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="issued">Issued</option>
                  <option value="quotes_received">Quotes Received</option>
                  <option value="evaluated">Evaluated</option>
                  <option value="awarded">Awarded</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
                >
                  <option value="all">All Categories</option>
                  <option value="raw_materials">Raw Materials</option>
                  <option value="components">Components</option>
                  <option value="services">Services</option>
                  <option value="equipment">Equipment</option>
                  <option value="consumables">Consumables</option>
                </select>
              </div>

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

        {/* RFQ Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-24rem)]">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    RFQ Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Closing Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Vendors Invited
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Quotes Received
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Estimated Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedRFQs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-semibold text-gray-900">{rfq.rfqNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{rfq.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{rfq.issueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{rfq.closingDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 text-center">{rfq.vendorsInvited}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600 text-center">{rfq.quotesReceived}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCategory(rfq.category)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatCurrency(rfq.estimatedValue)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(rfq.status)}`}>
                        {formatStatus(rfq.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(rfq.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                         
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(rfq.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                         
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {rfq.quotesReceived > 0 && (
                          <button
                            onClick={() => handleCompareQuotes(rfq.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                           
                          >
                            <GitCompare className="w-4 h-4" />
                          </button>
                        )}
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
                <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filteredRFQs.length)}</span> of{' '}
                <span className="font-semibold">{filteredRFQs.length}</span> RFQs
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
                          ? 'bg-purple-600 text-white'
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
    </div>
  )
}
