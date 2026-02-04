'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, Eye, Edit2, CheckCircle as CheckIcon, ClipboardCheck, XCircle, AlertTriangle, TrendingUp, Plus, Play, Loader2 } from 'lucide-react'
import { ViewInspectionModal, EditInspectionModal, ApproveInspectionModal, type Inspection } from '@/components/quality/QualityModals'
import { ExportInspectionReportModal } from '@/components/quality/QualityExportModals'
import Link from 'next/link'
import { InspectionService, Inspection as ServiceInspection, InspectionStatus, InspectionResult } from '@/services/inspection.service'

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
  pass_fail_status: 'pending' | 'passed' | 'failed' | 'conditional' | 'scheduled' | 'in_progress' | 'draft'
  remarks: string
  work_center: string
}

const ProductionQualityPage = () => {
  const [inspections, setInspections] = useState<QualityInspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [inspectionTypeFilter, setInspectionTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchInspections()
  }, [])

  // Transform service inspection to page format
  const transformInspection = (insp: ServiceInspection): QualityInspection => {
    // Map inspection type
    const typeMap: Record<string, QualityInspection['inspection_type']> = {
      'incoming': 'receiving',
      'in_process': 'in_process',
      'final': 'final',
      'first_article': 'first_article',
      'periodic': 'in_process',
      'supplier': 'audit',
      'customer': 'final',
    };

    // Map status
    const statusMap: Record<string, QualityInspection['pass_fail_status']> = {
      'draft': 'draft',
      'scheduled': 'scheduled',
      'in_progress': 'in_progress',
      'pending_review': 'pending',
      'approved': 'passed',
      'rejected': 'failed',
      'cancelled': 'failed',
    };

    // Map result
    const resultMap: Record<string, QualityInspection['pass_fail_status']> = {
      'pass': 'passed',
      'fail': 'failed',
      'conditional': 'conditional',
      'pending': 'pending',
    };

    // Determine the final status based on both status and result
    let finalStatus: QualityInspection['pass_fail_status'] = statusMap[insp.status] || 'pending';
    if (insp.status === InspectionStatus.APPROVED || insp.status === InspectionStatus.REJECTED) {
      finalStatus = resultMap[insp.overallResult] || finalStatus;
    }

    // Build defect categories from defect summary
    const defectCategories: { [key: string]: number } = {};
    if (insp.defectSummary.critical > 0) defectCategories['Critical'] = insp.defectSummary.critical;
    if (insp.defectSummary.major > 0) defectCategories['Major'] = insp.defectSummary.major;
    if (insp.defectSummary.minor > 0) defectCategories['Minor'] = insp.defectSummary.minor;
    if (insp.defectSummary.cosmetic > 0) defectCategories['Cosmetic'] = insp.defectSummary.cosmetic;

    return {
      id: insp.id,
      inspection_id: insp.inspectionNumber,
      work_order_id: insp.workOrderNumber || '-',
      product_name: insp.productName,
      product_code: insp.productCode,
      inspection_type: typeMap[insp.type] || 'in_process',
      inspection_date: new Date(insp.scheduledDate).toISOString().split('T')[0],
      inspector_name: insp.inspectorName,
      sample_size: insp.sampledQuantity,
      defects_found: insp.defectSummary.total,
      defect_categories: defectCategories,
      pass_fail_status: finalStatus,
      remarks: insp.notes || '',
      work_center: insp.location || insp.workstation || '-',
    };
  };

  const fetchInspections = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await InspectionService.getAllInspections()
      const transformedData = data.map(transformInspection)
      setInspections(transformedData)
    } catch (err) {
      console.error('Failed to fetch inspections:', err)
      setError('Failed to load inspections. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Modal state hooks
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<QualityInspection | null>(null)
  const [modalMode, setModalMode] = useState<'edit' | 'conduct'>('edit')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'scheduled':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
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

  const filteredInspections = inspections.filter(inspection => {
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

  const pendingInspections = inspections.filter(i => i.pass_fail_status === 'pending').length
  const passedInspections = inspections.filter(i => i.pass_fail_status === 'passed').length
  const failedInspections = inspections.filter(i => i.pass_fail_status === 'failed').length
  const totalInspections = inspections.filter(i => i.pass_fail_status !== 'pending').length
  const passRate = totalInspections > 0 ? ((passedInspections / totalInspections) * 100).toFixed(1) : '0.0'

  // Helper function to convert QualityInspection to Inspection modal format
  const convertToModalInspection = (inspection: QualityInspection): Inspection => {
    const inspectionTypeMap: Record<string, 'incoming' | 'in-process' | 'final' | 'pre-shipment'> = {
      'receiving': 'incoming',
      'in_process': 'in-process',
      'final': 'final',
      'first_article': 'in-process',
      'audit': 'final'
    }

    const statusMap: Record<string, 'pending' | 'passed' | 'failed' | 'conditional'> = {
      'pending': 'pending',
      'passed': 'passed',
      'failed': 'failed',
      'conditional': 'conditional'
    }

    return {
      id: inspection.inspection_id,
      workOrderId: inspection.work_order_id,
      productName: inspection.product_name,
      productCode: inspection.product_code,
      inspectionType: inspectionTypeMap[inspection.inspection_type] || 'in-process',
      inspectionDate: inspection.inspection_date,
      inspector: inspection.inspector_name,
      inspectorId: `INS-${inspection.inspector_name.replace(/\s/g, '')}`,
      workCenter: inspection.work_center,
      workCenterId: `WC-${inspection.work_center.replace(/\s/g, '')}`,
      sampleSize: inspection.sample_size,
      defectsFound: inspection.defects_found,
      status: statusMap[inspection.pass_fail_status] || 'pending',
      defectCategories: Object.entries(inspection.defect_categories).map(([category, count], index) => ({
        id: `${inspection.id}-defect-${index}`,
        category,
        count,
        severity: count > 3 ? 'major' : count > 1 ? 'minor' : 'minor'
      })),
      remarks: inspection.remarks
    }
  }

  // Handler functions
  const handleView = (inspection: QualityInspection) => {
    setSelectedInspection(inspection)
    setIsViewOpen(true)
  }

  const handleEdit = (inspection: QualityInspection) => {
    setSelectedInspection(inspection)
    setModalMode('edit')
    setIsEditOpen(true)
  }

  const handleConduct = (inspection: QualityInspection) => {
    setSelectedInspection(inspection)
    setModalMode('conduct')
    setIsEditOpen(true)
  }

  const handleApprove = (inspection: QualityInspection) => {
    setSelectedInspection(inspection)
    setIsApproveOpen(true)
  }

  const handleExport = () => {
    setIsExportOpen(true)
  }

  const handleViewClose = () => {
    setIsViewOpen(false)
    setSelectedInspection(null)
  }

  const handleEditSubmit = async (data: Inspection) => {
    try {
      const response = await fetch(`/api/quality/inspections/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchInspections();
        setIsEditOpen(false);
        setSelectedInspection(null);
      } else {
        console.error('Failed to update inspection');
      }
    } catch (error) {
      console.error('Error updating inspection:', error);
    }
  }

  const handleApproveSubmit = async (decision: 'approve' | 'reject' | 'request-changes', comments: string, signature: string) => {
    try {
      const endpoint = decision === 'approve' ? 'approve' : 'reject';
      const body = decision === 'approve'
        ? { approvedBy: signature }
        : { rejectedBy: signature, reason: comments };

      const response = await fetch(`/api/quality/inspections/${selectedInspection?.id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchInspections();
        setIsApproveOpen(false);
        setSelectedInspection(null);
      } else {
        console.error(`Failed to ${decision} inspection`);
      }
    } catch (error) {
      console.error(`Error ${decision}ing inspection:`, error);
    }
  }

  const handleExportSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/quality/inspection/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.url) {
          window.open(result.url, '_blank');
        }
        setIsExportOpen(false);
      } else {
        console.error('Failed to export inspection report');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  }

  return (
    <div className="w-full py-2 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Inspections</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{pendingInspections}</p>
            </div>
            <ClipboardCheck className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Passed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{passedInspections}</p>
            </div>
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Failed</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{failedInspections}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Pass Rate</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{passRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
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

              <div className="flex gap-2">
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

            <Link href="/quality/inspections/new">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5" />
                Schedule Inspection
              </button>
            </Link>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchInspections}
              className="text-red-700 underline text-sm hover:no-underline mt-1"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading inspections...</span>
          </div>
        ) : (
        <>
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-24rem)]">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspection ID
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Order
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspection Type
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspection Date
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspector Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sample Size
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Defects Found
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pass/Fail Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInspections.map((inspection) => (
                <tr key={inspection.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{inspection.inspection_id}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.work_order_id}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm font-medium text-gray-900">{inspection.product_name}</div>
                    <div className="text-sm text-gray-500">{inspection.product_code}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getInspectionTypeColor(inspection.inspection_type)}`}>
                      {inspection.inspection_type.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.inspection_date}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.inspector_name}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.sample_size}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
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
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(inspection.pass_fail_status)}`}>
                      {inspection.pass_fail_status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(inspection)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Inspection"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(inspection)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit Inspection"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      {(inspection.pass_fail_status === 'pending' || inspection.pass_fail_status === 'scheduled') && (
                        <button
                          onClick={() => handleConduct(inspection)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Conduct Inspection"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      )}
                      {inspection.pass_fail_status === 'pending' && (
                        <button
                          onClick={() => handleApprove(inspection)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve Inspection"
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

        <div className="px-3 py-2 border-t border-gray-200">
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
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${currentPage === i + 1
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
        </>
        )}
      </div>

      {/* Modal Components */}
      <ViewInspectionModal
        isOpen={isViewOpen}
        onClose={handleViewClose}
        inspection={selectedInspection ? convertToModalInspection(selectedInspection) : null}
        onEdit={(inspection) => {
          const qualityInspection = inspections.find(i => i.inspection_id === inspection.id)
          if (qualityInspection) {
            handleEdit(qualityInspection)
          }
        }}
      />

      <EditInspectionModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setSelectedInspection(null)
        }}
        onSave={handleEditSubmit}
        inspection={selectedInspection ? convertToModalInspection(selectedInspection) : null}
        mode={modalMode}
      />

      <ApproveInspectionModal
        isOpen={isApproveOpen}
        onClose={() => {
          setIsApproveOpen(false)
          setSelectedInspection(null)
        }}
        onApprove={handleApproveSubmit}
        inspection={selectedInspection ? convertToModalInspection(selectedInspection) : null}
      />

      <ExportInspectionReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExportSubmit}
      />
    </div>
  )
}

export default ProductionQualityPage
