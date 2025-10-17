'use client'

import React, { useState } from 'react'
import { Search, Filter, Download, Eye, Edit2, CheckCircle as CheckIcon, ClipboardCheck, XCircle, AlertTriangle, TrendingUp } from 'lucide-react'

interface QualityInspection {
  id: string
  inspection_id: string
  work_order_id: string
  product_name: string
  product_code: string
  inspection_type: 'in_process' | 'final' | 'first_article' | 'receiving' | 'audit'
  inspection_date: string
  inspector_name: string
  sample_size: number
  defects_found: number
  defect_categories: { [key: string]: number }
  pass_fail_status: 'pending' | 'passed' | 'failed' | 'conditional'
  remarks: string
  work_center: string
}

const mockInspections: QualityInspection[] = [
  {
    id: '1',
    inspection_id: 'QI-2024-001',
    work_order_id: 'WO-2024-045',
    product_name: 'Steel Frame Assembly',
    product_code: 'SFA-5000',
    inspection_type: 'in_process',
    inspection_date: '2024-01-15 10:30',
    inspector_name: 'Alice Johnson',
    sample_size: 50,
    defects_found: 2,
    defect_categories: { 'Dimensional': 1, 'Surface': 1 },
    pass_fail_status: 'passed',
    remarks: 'Minor defects within acceptable limits',
    work_center: 'Assembly Line 1'
  },
  {
    id: '2',
    inspection_id: 'QI-2024-002',
    work_order_id: 'WO-2024-046',
    product_name: 'Precision Gear Box',
    product_code: 'PGB-3200',
    inspection_type: 'final',
    inspection_date: '2024-01-15 14:00',
    inspector_name: 'Bob Martinez',
    sample_size: 30,
    defects_found: 0,
    defect_categories: {},
    pass_fail_status: 'passed',
    remarks: 'All samples passed inspection',
    work_center: 'Machining Center'
  },
  {
    id: '3',
    inspection_id: 'QI-2024-003',
    work_order_id: 'WO-2024-047',
    product_name: 'Hydraulic Cylinder',
    product_code: 'HC-1800',
    inspection_type: 'first_article',
    inspection_date: '2024-01-15 08:45',
    inspector_name: 'Carol White',
    sample_size: 5,
    defects_found: 1,
    defect_categories: { 'Coating': 1 },
    pass_fail_status: 'conditional',
    remarks: 'Coating thickness slightly below spec, monitoring required',
    work_center: 'Welding Shop'
  },
  {
    id: '4',
    inspection_id: 'QI-2024-004',
    work_order_id: 'WO-2024-048',
    product_name: 'Electric Motor Housing',
    product_code: 'EMH-2400',
    inspection_type: 'receiving',
    inspection_date: '2024-01-15 09:15',
    inspector_name: 'David Chen',
    sample_size: 100,
    defects_found: 8,
    defect_categories: { 'Dimensional': 5, 'Material': 3 },
    pass_fail_status: 'failed',
    remarks: 'Excessive defects, batch rejected',
    work_center: 'Paint Shop'
  },
  {
    id: '5',
    inspection_id: 'QI-2024-005',
    work_order_id: 'WO-2024-049',
    product_name: 'Conveyor Belt System',
    product_code: 'CBS-7500',
    inspection_type: 'audit',
    inspection_date: '2024-01-15 11:00',
    inspector_name: 'Emily Davis',
    sample_size: 20,
    defects_found: 0,
    defect_categories: {},
    pass_fail_status: 'pending',
    remarks: 'Awaiting final documentation review',
    work_center: 'Assembly Line 2'
  },
  {
    id: '6',
    inspection_id: 'QI-2024-006',
    work_order_id: 'WO-2024-050',
    product_name: 'Quality Control Jig',
    product_code: 'QCJ-1100',
    inspection_type: 'final',
    inspection_date: '2024-01-15 15:30',
    inspector_name: 'Frank Wilson',
    sample_size: 15,
    defects_found: 1,
    defect_categories: { 'Assembly': 1 },
    pass_fail_status: 'passed',
    remarks: 'Minor assembly issue corrected on-site',
    work_center: 'Quality Station'
  }
]

const ProductionQualityPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [inspectionTypeFilter, setInspectionTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'passed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'conditional':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getInspectionTypeColor = (type: string) => {
    switch (type) {
      case 'in_process':
        return 'text-blue-600'
      case 'final':
        return 'text-green-600'
      case 'first_article':
        return 'text-purple-600'
      case 'receiving':
        return 'text-orange-600'
      case 'audit':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredInspections = mockInspections.filter(inspection => {
    const matchesSearch =
      inspection.inspection_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.work_order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspector_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || inspection.pass_fail_status === statusFilter
    const matchesType = inspectionTypeFilter === 'all' || inspection.inspection_type === inspectionTypeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const totalPages = Math.ceil(filteredInspections.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInspections = filteredInspections.slice(startIndex, startIndex + itemsPerPage)

  const pendingInspections = mockInspections.filter(i => i.pass_fail_status === 'pending').length
  const passedInspections = mockInspections.filter(i => i.pass_fail_status === 'passed').length
  const failedInspections = mockInspections.filter(i => i.pass_fail_status === 'failed').length
  const totalInspections = mockInspections.filter(i => i.pass_fail_status !== 'pending').length
  const passRate = totalInspections > 0 ? ((passedInspections / totalInspections) * 100).toFixed(1) : '0.0'

  const handleExport = () => {
    console.log('Exporting quality inspection report...')
  }

  const handleView = (id: string) => {
    console.log('View inspection:', id)
  }

  const handleEdit = (id: string) => {
    console.log('Edit inspection:', id)
  }

  const handleApprove = (id: string) => {
    console.log('Approve inspection:', id)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quality Inspection</h1>
        <p className="text-gray-600">Monitor and manage quality control inspections across all production stages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending Inspections</p>
              <h3 className="text-3xl font-bold mt-2">{pendingInspections}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <ClipboardCheck className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-yellow-100">Awaiting review</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm font-medium">Passed</p>
              <h3 className="text-3xl font-bold mt-2">{passedInspections}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckIcon className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-100">Quality approved</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-red-100 text-sm font-medium">Failed</p>
              <h3 className="text-3xl font-bold mt-2">{failedInspections}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <XCircle className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-red-100">Quality rejected</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Pass Rate</p>
              <h3 className="text-3xl font-bold mt-2">{passRate}%</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-blue-100">Overall quality metric</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Inspection ID, Work Order, Product, Inspector..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                    <option value="conditional">Conditional</option>
                  </select>
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    value={inspectionTypeFilter}
                    onChange={(e) => setInspectionTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="in_process">In Process</option>
                    <option value="final">Final</option>
                    <option value="first_article">First Article</option>
                    <option value="receiving">Receiving</option>
                    <option value="audit">Audit</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspection ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspection Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspection Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspector Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sample Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Defects Found
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pass/Fail Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInspections.map((inspection) => (
                <tr key={inspection.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{inspection.inspection_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.work_order_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{inspection.product_name}</div>
                    <div className="text-sm text-gray-500">{inspection.product_code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getInspectionTypeColor(inspection.inspection_type)}`}>
                      {inspection.inspection_type.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.inspection_date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.inspector_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.sample_size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{inspection.defects_found}</div>
                      {inspection.defects_found > 0 && (
                        <div className="text-xs text-gray-500">
                          {Object.entries(inspection.defect_categories).map(([category, count]) => (
                            <span key={category} className="mr-1">{category}: {count}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(inspection.pass_fail_status)}`}>
                      {inspection.pass_fail_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(inspection.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(inspection.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      {inspection.pass_fail_status === 'pending' && (
                        <button
                          onClick={() => handleApprove(inspection.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredInspections.length)}
              </span>{' '}
              of <span className="font-medium">{filteredInspections.length}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductionQualityPage
