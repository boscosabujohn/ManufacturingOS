'use client';

import { useState } from 'react';
import { FileText, Folder, Upload, Download, Eye, Trash2, Search, Filter, Calendar, User, Edit, Share2, FolderInput, Lock, Clock, Archive, Tag, FileSearch } from 'lucide-react';
import {
 UploadDocumentModal,
 EditDocumentModal,
 ShareDocumentModal,
 MoveDocumentModal,
 CreateFolderModal,
 SetPermissionsModal,
 VersionHistoryModal,
 BulkDownloadModal,
 FilterDocumentsModal,
 SearchDocumentsModal,
 TagDocumentsModal,
 DeleteDocumentModal,
 PreviewDocumentModal,
 ViewDetailsModal,
} from '@/components/project-management/DocumentsModals';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

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
 const [activeTab, setActiveTab] = useState<'all' | 'my_approvals'>('all');
 const itemsPerPage = 12;

 // Modal states
 const [showEditModal, setShowEditModal] = useState(false);
 const [showShareModal, setShowShareModal] = useState(false);
 const [showMoveModal, setShowMoveModal] = useState(false);
 const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
 const [showPermissionsModal, setShowPermissionsModal] = useState(false);
 const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
 const [showBulkDownloadModal, setShowBulkDownloadModal] = useState(false);
 const [showFilterModal, setShowFilterModal] = useState(false);
 const [showSearchModal, setShowSearchModal] = useState(false);
 const [showTagModal, setShowTagModal] = useState(false);
 const [showDeleteModal, setShowDeleteModal] = useState(false);
 const [showPreviewModal, setShowPreviewModal] = useState(false);
 const [showDetailsModal, setShowDetailsModal] = useState(false);
 const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);

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
  {
   id: 'DOC-013',
   documentNumber: 'D-2025-013',
   projectId: 'PRJ-2025-001',
   projectName: 'Taj Hotels - Commercial Kitchen Setup',
   documentName: 'Kitchen Appliance Specifications - Complete Set',
   documentType: 'Specification',
   category: 'Technical',
   version: '1.0',
   uploadDate: '2025-01-10',
   uploadedBy: 'Sales Team',
   fileSize: '4.8 MB',
   fileFormat: 'PDF',
   status: 'Approved',
   accessLevel: 'Internal',
   reviewedBy: 'Technical Team',
   approvedBy: 'Project Manager',
   approvalDate: '2025-01-12',
   expiryDate: '',
   tags: ['Appliances', 'Specifications', 'Phase 1', 'Handover'],
   description: 'Complete appliance specifications including ranges, ovens, refrigeration, dishwashers, and food prep equipment. Part of Phase 1 handover package.',
   relatedDocuments: ['D-2025-001', 'D-2025-002'],
  },
  {
   id: 'DOC-014',
   documentNumber: 'D-2025-014',
   projectId: 'PRJ-2025-002',
   projectName: 'BigBasket Cold Storage Facility',
   documentName: 'Refrigeration Equipment Specifications',
   documentType: 'Specification',
   category: 'Technical',
   version: '1.0',
   uploadDate: '2025-01-18',
   uploadedBy: 'Priya Sharma',
   fileSize: '3.2 MB',
   fileFormat: 'PDF',
   status: 'Approved',
   accessLevel: 'Internal',
   reviewedBy: 'Cold Chain Specialist',
   approvedBy: 'Project Manager',
   approvalDate: '2025-01-19',
   expiryDate: '',
   tags: ['Refrigeration', 'Specifications', 'Cold Storage', 'Appliances'],
   description: 'Detailed specifications for industrial refrigeration units, compressors, and temperature monitoring systems.',
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

  // Tab filtering
  const matchesTab = activeTab === 'all' || (activeTab === 'my_approvals' && doc.status === 'Under Review'); // Mock logic for "My Approvals"

  return matchesSearch && matchesType && matchesStatus && matchesProject && matchesTab;
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

 // Handler functions
 const handleUpload = (data: any) => {
  console.log('Uploading document:', data);
  setShowUploadModal(false);
 };

 const handleEdit = (data: any) => {
  console.log('Editing document:', selectedDocument?.id, data);
  setShowEditModal(false);
  setSelectedDocument(null);
 };

 const handleShare = (data: any) => {
  console.log('Sharing document:', selectedDocument?.id, data);
  setShowShareModal(false);
  setSelectedDocument(null);
 };

 const handleMove = (data: any) => {
  console.log('Moving document:', selectedDocument?.id, data);
  setShowMoveModal(false);
  setSelectedDocument(null);
 };

 const handleCreateFolder = (data: any) => {
  console.log('Creating folder:', data);
  setShowCreateFolderModal(false);
 };

 const handleSetPermissions = (data: any) => {
  console.log('Setting permissions:', selectedDocument?.id, data);
  setShowPermissionsModal(false);
  setSelectedDocument(null);
 };

 const handleVersionHistory = () => {
  console.log('Version history for:', selectedDocument?.id);
  setShowVersionHistoryModal(false);
  setSelectedDocument(null);
 };

 const handleBulkDownload = () => {
  console.log('Bulk downloading:', selectedDocuments.length, 'documents');
  setShowBulkDownloadModal(false);
 };

 const handleFilterDocuments = (data: any) => {
  console.log('Applying filters:', data);
  setShowFilterModal(false);
 };

 const handleSearchDocuments = (data: any) => {
  console.log('Searching documents:', data);
  setShowSearchModal(false);
 };

 const handleTagDocuments = (data: any) => {
  console.log('Tagging documents:', selectedDocuments.length, data);
  setShowTagModal(false);
 };

 const handleDelete = () => {
  console.log('Deleting document:', selectedDocument?.id);
  setShowDeleteModal(false);
  setSelectedDocument(null);
 };

 const handlePreview = () => {
  console.log('Previewing document:', selectedDocument?.id);
 };

 const handleViewDetails = () => {
  console.log('Viewing details:', selectedDocument?.id);
 };

 // Helper functions to open modals with context
 const openEditModal = (doc: Document) => {
  setSelectedDocument(doc);
  setShowEditModal(true);
 };

 const openShareModal = (doc: Document) => {
  setSelectedDocument(doc);
  setShowShareModal(true);
 };

 const openMoveModal = (doc: Document) => {
  setSelectedDocument(doc);
  setShowMoveModal(true);
 };

 const openPermissionsModal = (doc: Document) => {
  setSelectedDocument(doc);
  setShowPermissionsModal(true);
 };

 const openVersionHistoryModal = (doc: Document) => {
  setSelectedDocument(doc);
  setShowVersionHistoryModal(true);
 };

 const openPreviewModal = (doc: Document) => {
  setSelectedDocument(doc);
  setShowPreviewModal(true);
 };

 const openDeleteModal = (doc: Document) => {
  setSelectedDocument(doc);
  setShowDeleteModal(true);
 };

 const openDetailsModal = (doc: Document) => {
  setSelectedDocument(doc);
  setShowDetailsModal(true);
 };

 return (
  <div className="w-full h-screen overflow-y-auto overflow-x-hidden">
   <div className="px-3 py-2 space-y-3">
    {/* Professional Header */}
    <div className="bg-white rounded-lg border border-gray-200 p-3">
     <div className="flex justify-between items-start mb-3">
      <div>
       <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
       <p className="text-sm text-gray-600 mt-1">Manage and organize all project documents in one place</p>
      </div>
     </div>

     {/* Tabs */}
     <div className="border-b border-gray-200 mb-3">
      <nav className="-mb-px flex space-x-8">
       <button
        onClick={() => setActiveTab('all')}
        className={`${activeTab === 'all'
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
         } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
       >
        All Documents
       </button>
       <button
        onClick={() => setActiveTab('my_approvals')}
        className={`${activeTab === 'my_approvals'
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
         } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
       >
        My Approvals
        <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
         {mockDocuments.filter(d => d.status === 'Under Review').length}
        </span>
       </button>
      </nav>
     </div>

     {/* Action Buttons Row */}
     <div className="flex flex-wrap gap-3">
      <DropdownMenu>
       <DropdownMenuTrigger asChild>
        <button
         className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
         <Upload className="h-4 w-4" />
         <span>Upload Document</span>
        </button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Select Document Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
         <Link href="/project-management/documents/upload/boq" className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          <span>Bill of Quantities (BOQ)</span>
         </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
         <Link href="/project-management/documents/upload/drawings" className="cursor-pointer">
          <Folder className="mr-2 h-4 w-4" />
          <span>Drawings & Plans</span>
         </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
         <Link href="/project-management/documents/upload/renders" className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          <span>3D Renders & Visuals</span>
         </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setShowUploadModal(true)}>
         <Upload className="mr-2 h-4 w-4" />
         <span>Other Documents</span>
        </DropdownMenuItem>
       </DropdownMenuContent>
      </DropdownMenu>
      <button
       onClick={() => setShowCreateFolderModal(true)}
       className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
      >
       <FolderInput className="h-4 w-4" />
       <span>Create Folder</span>
      </button>
      <button
       onClick={() => setShowSearchModal(true)}
       className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
      >
       <FileSearch className="h-4 w-4" />
       <span>Advanced Search</span>
      </button>
      <button
       onClick={() => setShowFilterModal(true)}
       className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
      >
       <Filter className="h-4 w-4" />
       <span>Filter</span>
      </button>
      <button
       onClick={() => setShowBulkDownloadModal(true)}
       className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
       <Archive className="h-4 w-4" />
       <span>Bulk Download</span>
      </button>
      <button
       onClick={() => setShowTagModal(true)}
       className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
      >
       <Tag className="h-4 w-4" />
       <span>Tag Selected</span>
      </button>
      <button
       className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
       <Download className="h-4 w-4" />
       <span>Export</span>
      </button>
     </div>
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
      className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
       }`}
     >
      List View
     </button>
     <button
      onClick={() => setViewMode('grid')}
      className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
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
           <td className="px-4 py-4">
            <div className="flex flex-col items-center space-y-2">
             {/* First row - 5 buttons */}
             <div className="flex items-center space-x-1">
              <button
               onClick={() => openPreviewModal(doc)}
               className="p-1.5 rounded hover:bg-violet-50 text-violet-600 hover:text-violet-800 transition-colors"
               title="Preview"
              >
               <Eye className="h-4 w-4" />
              </button>
              <button
               onClick={() => openDetailsModal(doc)}
               className="p-1.5 rounded hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-colors"
               title="View Details"
              >
               <FileText className="h-4 w-4" />
              </button>
              <button
               onClick={() => openEditModal(doc)}
               className="p-1.5 rounded hover:bg-green-50 text-green-600 hover:text-green-800 transition-colors"
               title="Edit"
              >
               <Edit className="h-4 w-4" />
              </button>
              <button
               onClick={() => openShareModal(doc)}
               className="p-1.5 rounded hover:bg-purple-50 text-purple-600 hover:text-purple-800 transition-colors"
               title="Share"
              >
               <Share2 className="h-4 w-4" />
              </button>
              <button
               className="p-1.5 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition-colors"
               title="Download"
              >
               <Download className="h-4 w-4" />
              </button>
             </div>
             {/* Second row - 4 buttons */}
             <div className="flex items-center space-x-1">
              <button
               onClick={() => openMoveModal(doc)}
               className="p-1.5 rounded hover:bg-orange-50 text-orange-600 hover:text-orange-800 transition-colors"
               title="Move"
              >
               <FolderInput className="h-4 w-4" />
              </button>
              <button
               onClick={() => openPermissionsModal(doc)}
               className="p-1.5 rounded hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 transition-colors"
               title="Permissions"
              >
               <Lock className="h-4 w-4" />
              </button>
              <button
               onClick={() => openVersionHistoryModal(doc)}
               className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600 hover:text-yellow-800 transition-colors"
               title="Version History"
              >
               <Clock className="h-4 w-4" />
              </button>
              <button
               onClick={() => openDeleteModal(doc)}
               className="p-1.5 rounded hover:bg-red-50 text-red-600 hover:text-red-800 transition-colors"
               title="Delete"
              >
               <Trash2 className="h-4 w-4" />
              </button>
             </div>
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
           className={`px-3 py-1 border rounded-md text-sm font-medium ${currentPage === page
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

          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-2 mt-4 w-full">
           {/* First row - 3 buttons */}
           <div className="flex items-center space-x-1">
            <button
             onClick={() => openPreviewModal(doc)}
             className="p-2 rounded hover:bg-violet-50 text-violet-600 hover:text-violet-800 transition-colors"
             title="Preview"
            >
             <Eye className="h-4 w-4" />
            </button>
            <button
             className="p-2 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition-colors"
             title="Download"
            >
             <Download className="h-4 w-4" />
            </button>
            <button
             onClick={() => openShareModal(doc)}
             className="p-2 rounded hover:bg-purple-50 text-purple-600 hover:text-purple-800 transition-colors"
             title="Share"
            >
             <Share2 className="h-4 w-4" />
            </button>
           </div>
           {/* Second row - 3 buttons */}
           <div className="flex items-center space-x-1">
            <button
             onClick={() => openEditModal(doc)}
             className="p-2 rounded hover:bg-green-50 text-green-600 hover:text-green-800 transition-colors"
             title="Edit"
            >
             <Edit className="h-4 w-4" />
            </button>
            <button
             onClick={() => openMoveModal(doc)}
             className="p-2 rounded hover:bg-orange-50 text-orange-600 hover:text-orange-800 transition-colors"
             title="Move"
            >
             <FolderInput className="h-4 w-4" />
            </button>
            <button
             onClick={() => openDeleteModal(doc)}
             className="p-2 rounded hover:bg-red-50 text-red-600 hover:text-red-800 transition-colors"
             title="Delete"
            >
             <Trash2 className="h-4 w-4" />
            </button>
           </div>
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
          className={`px-3 py-1 border rounded-md text-sm font-medium ${currentPage === page
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

    {/* All Modals */}
    <UploadDocumentModal
     isOpen={showUploadModal}
     onClose={() => setShowUploadModal(false)}
     onUpload={handleUpload}
    />

    <EditDocumentModal
     isOpen={showEditModal}
     onClose={() => setShowEditModal(false)}
     onEdit={handleEdit}
     doc={selectedDocument}
    />

    <ShareDocumentModal
     isOpen={showShareModal}
     onClose={() => setShowShareModal(false)}
     onShare={handleShare}
     doc={selectedDocument}
    />

    <MoveDocumentModal
     isOpen={showMoveModal}
     onClose={() => setShowMoveModal(false)}
     onMove={handleMove}
     doc={selectedDocument}
    />

    <CreateFolderModal
     isOpen={showCreateFolderModal}
     onClose={() => setShowCreateFolderModal(false)}
     onCreate={handleCreateFolder}
    />

    <SetPermissionsModal
     isOpen={showPermissionsModal}
     onClose={() => setShowPermissionsModal(false)}
     onSet={handleSetPermissions}
     doc={selectedDocument}
    />

    <VersionHistoryModal
     isOpen={showVersionHistoryModal}
     onClose={() => setShowVersionHistoryModal(false)}
     doc={selectedDocument}
    />

    <BulkDownloadModal
     isOpen={showBulkDownloadModal}
     onClose={() => setShowBulkDownloadModal(false)}
     onDownload={handleBulkDownload}
     selectedDocs={selectedDocuments}
    />

    <FilterDocumentsModal
     isOpen={showFilterModal}
     onClose={() => setShowFilterModal(false)}
     onApply={handleFilterDocuments}
    />

    <SearchDocumentsModal
     isOpen={showSearchModal}
     onClose={() => setShowSearchModal(false)}
     onSearch={handleSearchDocuments}
    />

    <TagDocumentsModal
     isOpen={showTagModal}
     onClose={() => setShowTagModal(false)}
     onTag={handleTagDocuments}
     selectedDocs={selectedDocuments}
    />

    <DeleteDocumentModal
     isOpen={showDeleteModal}
     onClose={() => setShowDeleteModal(false)}
     onDelete={handleDelete}
     doc={selectedDocument}
    />

    <PreviewDocumentModal
     isOpen={showPreviewModal}
     onClose={() => setShowPreviewModal(false)}
     doc={selectedDocument}
    />

    <ViewDetailsModal
     isOpen={showDetailsModal}
     onClose={() => setShowDetailsModal(false)}
     doc={selectedDocument}
    />
   </div>
  </div>
 );
}
