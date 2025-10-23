'use client';

import { useState } from 'react';
import { FileText, Folder, Upload, Download, Eye, Trash2, Search, Filter, Calendar, User } from 'lucide-react';

interface Document {
  id: string;
  documentNumber: string;
  projectId: string;
  projectName: string;
  documentName: string;
  documentType: 'Drawing' | 'Specification' | 'Report' | 'Certificate' | 'Manual' | 'Contract' | 'Invoice' | 'Photo' | 'Other';
  category: 'Technical' | 'Financial' | 'Legal' | 'Quality' | 'Safety' | 'Operational';
  version: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: string;
  fileFormat: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Superseded' | 'Archived';
  accessLevel: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  reviewedBy: string;
  approvedBy: string;
  approvalDate: string;
  expiryDate: string;
  tags: string[];
  description: string;
  relatedDocuments: string[];
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const mockDocuments: Document[] = [
    {
      id: 'DOC-001',
      documentNumber: 'D-2025-001',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      documentName: 'Equipment Layout Drawing - Rev 3',
      documentType: 'Drawing',
      category: 'Technical',
      version: '3.0',
      uploadDate: '2025-01-20',
      uploadedBy: 'Ramesh Kumar',
      fileSize: '2.4 MB',
      fileFormat: 'PDF',
      status: 'Approved',
      accessLevel: 'Internal',
      reviewedBy: 'Project Manager',
      approvedBy: 'Client Representative',
      approvalDate: '2025-01-21',
      expiryDate: '',
      tags: ['Layout', 'Equipment', 'Approved'],
      description: 'Final approved layout drawing showing all equipment positions with dimensions',
      relatedDocuments: ['D-2025-002', 'D-2025-005'],
    },
    {
      id: 'DOC-002',
      documentNumber: 'D-2025-002',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      documentName: 'Electrical Single Line Diagram',
      documentType: 'Drawing',
      category: 'Technical',
      version: '2.0',
      uploadDate: '2025-01-18',
      uploadedBy: 'Prakash Rao',
      fileSize: '1.8 MB',
      fileFormat: 'PDF',
      status: 'Approved',
      accessLevel: 'Internal',
      reviewedBy: 'Electrical Engineer',
      approvedBy: 'Project Manager',
      approvalDate: '2025-01-19',
      expiryDate: '',
      tags: ['Electrical', 'SLD', 'Approved'],
      description: 'Complete electrical distribution diagram with load calculations',
      relatedDocuments: ['D-2025-001', 'D-2025-003'],
    },
    {
      id: 'DOC-003',
      documentNumber: 'D-2025-003',
      projectId: 'PRJ-2025-002',
      projectName: 'BigBasket - Cold Room Installation',
      documentName: 'Commissioning Test Report',
      documentType: 'Report',
      category: 'Quality',
      version: '1.0',
      uploadDate: '2025-01-22',
      uploadedBy: 'Suresh Patel',
      fileSize: '3.2 MB',
      fileFormat: 'PDF',
      status: 'Under Review',
      accessLevel: 'Internal',
      reviewedBy: 'QC Manager',
      approvedBy: '',
      approvalDate: '',
      expiryDate: '',
      tags: ['Testing', 'Commissioning', 'Cold Room'],
      description: 'Temperature pull-down test and stability test results with charts',
      relatedDocuments: ['D-2025-010'],
    },
    {
      id: 'DOC-004',
      documentNumber: 'D-2025-004',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      documentName: 'Fire Safety Certificate',
      documentType: 'Certificate',
      category: 'Safety',
      version: '1.0',
      uploadDate: '2025-01-15',
      uploadedBy: 'Vijay Sharma',
      fileSize: '0.8 MB',
      fileFormat: 'PDF',
      status: 'Approved',
      accessLevel: 'Public',
      reviewedBy: 'Safety Officer',
      approvedBy: 'Fire Department',
      approvalDate: '2025-01-15',
      expiryDate: '2026-01-15',
      tags: ['Certificate', 'Fire Safety', 'Compliance'],
      description: 'Fire NOC from local fire department for kitchen installation',
      relatedDocuments: [],
    },
    {
      id: 'DOC-005',
      documentNumber: 'D-2025-005',
      projectId: 'PRJ-2025-003',
      projectName: 'L&T Campus - Industrial Kitchen',
      documentName: 'Equipment Specification Sheet',
      documentType: 'Specification',
      category: 'Technical',
      version: '2.0',
      uploadDate: '2025-01-12',
      uploadedBy: 'Amit Singh',
      fileSize: '4.5 MB',
      fileFormat: 'PDF',
      status: 'Approved',
      accessLevel: 'Internal',
      reviewedBy: 'Technical Team',
      approvedBy: 'Client',
      approvalDate: '2025-01-14',
      expiryDate: '',
      tags: ['Specifications', 'Equipment', 'Technical'],
      description: 'Detailed specifications for all kitchen equipment including capacities and features',
      relatedDocuments: ['D-2025-006'],
    },
    {
      id: 'DOC-006',
      documentNumber: 'D-2025-006',
      projectId: 'PRJ-2025-004',
      projectName: 'ITC Grand - Bakery Equipment Setup',
      documentName: 'Operation & Maintenance Manual',
      documentType: 'Manual',
      category: 'Operational',
      version: '1.0',
      uploadDate: '2025-01-20',
      uploadedBy: 'Dinesh Kumar',
      fileSize: '12.8 MB',
      fileFormat: 'PDF',
      status: 'Approved',
      accessLevel: 'Public',
      reviewedBy: 'Service Engineer',
      approvedBy: 'Client',
      approvalDate: '2025-01-20',
      expiryDate: '',
      tags: ['Manual', 'O&M', 'Training'],
      description: 'Complete O&M manual covering all equipment with troubleshooting guides',
      relatedDocuments: [],
    },
    {
      id: 'DOC-007',
      documentNumber: 'D-2025-007',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      documentName: 'Project Contract Agreement',
      documentType: 'Contract',
      category: 'Legal',
      version: '1.0',
      uploadDate: '2024-11-25',
      uploadedBy: 'Legal Team',
      fileSize: '1.2 MB',
      fileFormat: 'PDF',
      status: 'Approved',
      accessLevel: 'Confidential',
      reviewedBy: 'Legal Advisor',
      approvedBy: 'Management',
      approvalDate: '2024-11-25',
      expiryDate: '',
      tags: ['Contract', 'Legal', 'Agreement'],
      description: 'Signed contract agreement with terms and conditions',
      relatedDocuments: ['D-2025-008'],
    },
    {
      id: 'DOC-008',
      documentNumber: 'D-2025-008',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      documentName: 'Final Invoice - Phase 1',
      documentType: 'Invoice',
      category: 'Financial',
      version: '1.0',
      uploadDate: '2025-01-22',
      uploadedBy: 'Accounts Team',
      fileSize: '0.6 MB',
      fileFormat: 'PDF',
      status: 'Approved',
      accessLevel: 'Confidential',
      reviewedBy: 'Finance Manager',
      approvedBy: 'Client',
      approvalDate: '2025-01-23',
      expiryDate: '',
      tags: ['Invoice', 'Payment', 'Financial'],
      description: 'Phase 1 completion invoice with detailed cost breakdown',
      relatedDocuments: ['D-2025-007'],
    },
    {
      id: 'DOC-009',
      documentNumber: 'D-2025-009',
      projectId: 'PRJ-2025-005',
      projectName: 'Godrej Properties - Modular Kitchen',
      documentName: 'Installation Photos - Set 1',
      documentType: 'Photo',
      category: 'Quality',
      version: '1.0',
      uploadDate: '2025-01-20',
      uploadedBy: 'Ravi Shankar',
      fileSize: '18.4 MB',
      fileFormat: 'ZIP',
      status: 'Approved',
      accessLevel: 'Internal',
      reviewedBy: 'Project Manager',
      approvedBy: 'Client',
      approvalDate: '2025-01-21',
      expiryDate: '',
      tags: ['Photos', 'Installation', 'Documentation'],
      description: 'High resolution installation progress photos - 45 images',
      relatedDocuments: [],
    },
    {
      id: 'DOC-010',
      documentNumber: 'D-2025-010',
      projectId: 'PRJ-2025-002',
      projectName: 'BigBasket - Cold Room Installation',
      documentName: 'Warranty Certificate',
      documentType: 'Certificate',
      category: 'Operational',
      version: '1.0',
      uploadDate: '2025-01-22',
      uploadedBy: 'Venkat Rao',
      fileSize: '0.4 MB',
      fileFormat: 'PDF',
      status: 'Approved',
      accessLevel: 'Public',
      reviewedBy: 'Service Manager',
      approvedBy: 'Client',
      approvalDate: '2025-01-22',
      expiryDate: '2026-01-22',
      tags: ['Warranty', 'Certificate', 'Service'],
      description: '12 months comprehensive warranty certificate for all equipment',
      relatedDocuments: ['D-2025-003'],
    },
    {
      id: 'DOC-011',
      documentNumber: 'D-2025-011',
      projectId: 'PRJ-2025-006',
      projectName: 'Siemens - Switchgear Manufacturing Unit',
      documentName: 'Clean Room Validation Report',
      documentType: 'Report',
      category: 'Quality',
      version: 'Draft',
      uploadDate: '2025-01-23',
      uploadedBy: 'Mahesh Gupta',
      fileSize: '5.6 MB',
      fileFormat: 'PDF',
      status: 'Draft',
      accessLevel: 'Internal',
      reviewedBy: '',
      approvedBy: '',
      approvalDate: '',
      expiryDate: '',
      tags: ['Validation', 'Clean Room', 'Draft'],
      description: 'Clean room classification validation report - pending final review',
      relatedDocuments: [],
    },
    {
      id: 'DOC-012',
      documentNumber: 'D-2025-012',
      projectId: 'PRJ-2025-003',
      projectName: 'L&T Campus - Industrial Kitchen',
      documentName: 'HVAC Duct Leakage Test Report',
      documentType: 'Report',
      category: 'Quality',
      version: '2.0',
      uploadDate: '2025-01-21',
      uploadedBy: 'Anil Joshi',
      fileSize: '2.1 MB',
      fileFormat: 'PDF',
      status: 'Superseded',
      accessLevel: 'Internal',
      reviewedBy: 'HVAC Engineer',
      approvedBy: 'Project Manager',
      approvalDate: '2025-01-21',
      expiryDate: '',
      tags: ['Test Report', 'HVAC', 'Superseded'],
      description: 'Initial leakage test report - superseded by rectification report',
      relatedDocuments: [],
    },
  ];

  const stats = {
    totalDocuments: mockDocuments.length,
    approved: mockDocuments.filter(d => d.status === 'Approved').length,
    pending: mockDocuments.filter(d => d.status === 'Under Review').length,
    draft: mockDocuments.filter(d => d.status === 'Draft').length,
    totalSize: mockDocuments.reduce((sum, d) => {
      const size = parseFloat(d.fileSize);
      return sum + size;
    }, 0).toFixed(1),
  };

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || doc.documentType === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesProject = filterProject === 'all' || doc.projectId === filterProject;
    return matchesSearch && matchesType && matchesStatus && matchesProject;
  });

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

  const uniqueProjects = Array.from(new Set(mockDocuments.map(d => d.projectId)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'Superseded':
        return 'bg-gray-100 text-gray-800';
      case 'Archived':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Drawing':
        return '📐';
      case 'Specification':
        return '📋';
      case 'Report':
        return '📊';
      case 'Certificate':
        return '🏆';
      case 'Manual':
        return '📖';
      case 'Contract':
        return '📝';
      case 'Invoice':
        return '💰';
      case 'Photo':
        return '📷';
      default:
        return '📄';
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'Public':
        return 'text-green-600';
      case 'Internal':
        return 'text-blue-600';
      case 'Confidential':
        return 'text-orange-600';
      case 'Restricted':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalSize} MB</p>
            </div>
            <Folder className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents, tags, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Drawing">Drawing</option>
              <option value="Specification">Specification</option>
              <option value="Report">Report</option>
              <option value="Certificate">Certificate</option>
              <option value="Manual">Manual</option>
              <option value="Contract">Contract</option>
              <option value="Invoice">Invoice</option>
              <option value="Photo">Photo</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Superseded">Superseded</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Projects</option>
              {uniqueProjects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-1 rounded ${
            viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1 rounded ${
            viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Grid View
        </button>
      </div>

      {/* Documents List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type / Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version / Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(doc.documentType)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doc.documentName}</div>
                          <div className="text-xs text-gray-500">{doc.documentNumber}</div>
                          <div className="text-xs text-gray-500">{doc.fileSize} • {doc.fileFormat}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{doc.projectId}</div>
                      <div className="text-xs text-gray-500">{doc.projectName}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{doc.documentType}</div>
                      <div className="text-xs text-gray-500">{doc.category}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">v{doc.version}</div>
                      <div className="text-xs text-gray-500">{doc.uploadDate}</div>
                      <div className="text-xs text-gray-500">by {doc.uploadedBy}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      <div className={`text-xs mt-1 ${getAccessLevelColor(doc.accessLevel)}`}>
                        {doc.accessLevel}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800"
                          title="Download"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredDocuments.length)}</span> of{' '}
                <span className="font-medium">{filteredDocuments.length}</span> documents
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <span className="text-5xl mb-3">{getTypeIcon(doc.documentType)}</span>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{doc.documentName}</h3>
                  <p className="text-xs text-gray-500 mb-2">{doc.documentNumber}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                  <p className="text-xs text-gray-500">{doc.fileSize} • {doc.fileFormat}</p>
                  <p className="text-xs text-gray-500">v{doc.version}</p>
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    <button
                      onClick={() => setSelectedDocument(doc)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Download className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination for Grid View */}
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedDocument.documentName}</h2>
                <p className="text-sm text-gray-600">{selectedDocument.documentNumber}</p>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Document Type</p>
                  <p className="font-medium text-gray-900">{selectedDocument.documentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">{selectedDocument.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="font-medium text-gray-900">v{selectedDocument.version}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDocument.status)}`}>
                    {selectedDocument.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">File Size</p>
                  <p className="font-medium text-gray-900">{selectedDocument.fileSize} ({selectedDocument.fileFormat})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Access Level</p>
                  <p className={`font-medium ${getAccessLevelColor(selectedDocument.accessLevel)}`}>
                    {selectedDocument.accessLevel}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-gray-900">{selectedDocument.description}</p>
              </div>

              {/* Tags */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upload & Approval Info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Uploaded By</p>
                  <p className="font-medium text-gray-900">{selectedDocument.uploadedBy}</p>
                  <p className="text-xs text-gray-500">{selectedDocument.uploadDate}</p>
                </div>
                {selectedDocument.approvedBy && (
                  <div>
                    <p className="text-sm text-gray-600">Approved By</p>
                    <p className="font-medium text-gray-900">{selectedDocument.approvedBy}</p>
                    <p className="text-xs text-gray-500">{selectedDocument.approvalDate}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal - Simplified */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Document upload form - Full interface would be implemented here.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
