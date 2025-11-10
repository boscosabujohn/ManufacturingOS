'use client';

import { useState } from 'react';
import { FileCheck, CheckCircle, Clock, AlertTriangle, XCircle, Plus, Download, Eye, FileText, Edit, ListChecks, FileStack, Wrench, GraduationCap, Shield, PenTool, RefreshCw, Upload, FileOutput } from 'lucide-react';
import { ScheduleAcceptanceModal, EditAcceptanceModal, UpdateCriteriaModal, UpdateDocumentationModal, AddPunchListItemsModal, UpdateTrainingStatusModal, UpdateWarrantyModal, SignAcceptanceModal, UpdateStatusModal, UploadAttachmentsModal, GenerateReportModal, ViewFullDetailsModal } from '@/components/project-management/CustomerAcceptanceModals';

interface AcceptanceCriteria {
  id: string;
  criterion: string;
  status: 'Met' | 'Not Met' | 'Partially Met' | 'Waived';
  remarks: string;
}

interface Documentation {
  id: string;
  documentName: string;
  status: 'Submitted' | 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
}

interface CustomerAcceptance {
  id: string;
  acceptanceNumber: string;
  projectId: string;
  projectName: string;
  projectType: string;
  customer: string;
  customerContact: string;
  customerEmail: string;
  acceptanceDate: string;
  acceptanceType: 'Provisional' | 'Final' | 'Partial' | 'Conditional';
  phase: string;
  deliverables: string[];
  acceptanceCriteria: AcceptanceCriteria[];
  totalCriteria: number;
  criteriaMet: number;
  criteriaPending: number;
  documentation: Documentation[];
  totalDocuments: number;
  docsSubmitted: number;
  docsPending: number;
  defectsList: string[];
  punchListItems: number;
  completedPunchItems: number;
  trainingCompleted: boolean;
  warrantyPeriod: string;
  warrantyStartDate: string;
  amcOffered: boolean;
  amcDuration: string;
  signedBy: string;
  signedByDesignation: string;
  signedDate: string;
  witnessedBy: string;
  overallStatus: 'Accepted' | 'Rejected' | 'Pending' | 'Conditional';
  remarks: string;
  attachments: number;
}

export default function CustomerAcceptancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAcceptance, setSelectedAcceptance] = useState<CustomerAcceptance | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpdateCriteriaModal, setShowUpdateCriteriaModal] = useState(false);
  const [showUpdateDocumentationModal, setShowUpdateDocumentationModal] = useState(false);
  const [showAddPunchListModal, setShowAddPunchListModal] = useState(false);
  const [showUpdateTrainingModal, setShowUpdateTrainingModal] = useState(false);
  const [showUpdateWarrantyModal, setShowUpdateWarrantyModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showUploadAttachmentsModal, setShowUploadAttachmentsModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [showViewFullDetailsModal, setShowViewFullDetailsModal] = useState(false);

  const mockAcceptances: CustomerAcceptance[] = [
    {
      id: 'CA-001',
      acceptanceNumber: 'ACC-2025-001',
      projectId: 'PRJ-2025-004',
      projectName: 'ITC Grand - Bakery Equipment Setup',
      projectType: 'Commercial Kitchen',
      customer: 'ITC Limited',
      customerContact: 'Mr. Rajesh Sharma',
      customerEmail: 'rajesh.sharma@itchotels.com',
      acceptanceDate: '2025-01-20',
      acceptanceType: 'Final',
      phase: 'Project Handover',
      deliverables: ['Deck Oven - 3 units', 'Planetary Mixer - 2 units', 'Proofer - 1 unit', 'Dough Sheeter - 1 unit', 'Training & Manuals'],
      acceptanceCriteria: [
        { id: 'CR-001', criterion: 'All equipment operational and tested', status: 'Met', remarks: 'All units working as per specifications' },
        { id: 'CR-002', criterion: 'Installation as per approved layout', status: 'Met', remarks: 'Layout matches approved drawings' },
        { id: 'CR-003', criterion: 'Safety compliance certified', status: 'Met', remarks: 'Fire safety and electrical safety certificates obtained' },
        { id: 'CR-004', criterion: 'Staff training completed', status: 'Met', remarks: '6 staff members trained and certified' },
        { id: 'CR-005', criterion: 'Documentation handover', status: 'Met', remarks: 'All manuals, warranties, and certificates provided' },
      ],
      totalCriteria: 5,
      criteriaMet: 5,
      criteriaPending: 0,
      documentation: [
        { id: 'DOC-001', documentName: 'Operation Manuals', status: 'Approved', submittedDate: '2025-01-18' },
        { id: 'DOC-002', documentName: 'Warranty Certificates', status: 'Approved', submittedDate: '2025-01-18' },
        { id: 'DOC-003', documentName: 'Test Reports', status: 'Approved', submittedDate: '2025-01-19' },
        { id: 'DOC-004', documentName: 'Safety Certificates', status: 'Approved', submittedDate: '2025-01-19' },
        { id: 'DOC-005', documentName: 'Training Certificates', status: 'Approved', submittedDate: '2025-01-20' },
      ],
      totalDocuments: 5,
      docsSubmitted: 5,
      docsPending: 0,
      defectsList: [],
      punchListItems: 3,
      completedPunchItems: 3,
      trainingCompleted: true,
      warrantyPeriod: '24 months',
      warrantyStartDate: '2025-01-20',
      amcOffered: true,
      amcDuration: '36 months',
      signedBy: 'Mr. Rajesh Sharma',
      signedByDesignation: 'General Manager - Operations',
      signedDate: '2025-01-20',
      witnessedBy: 'Project Manager - ManufacturingOS',
      overallStatus: 'Accepted',
      remarks: 'Project completed to full satisfaction. All deliverables met. Client appreciates quality of installation and training provided.',
      attachments: 12,
    },
    {
      id: 'CA-002',
      acceptanceNumber: 'ACC-2025-002',
      projectId: 'PRJ-2025-002',
      projectName: 'BigBasket - Cold Room Installation',
      projectType: 'Cold Room',
      customer: 'Innovative Retail Concepts Pvt Ltd',
      customerContact: 'Ms. Priya Menon',
      customerEmail: 'priya.menon@bigbasket.com',
      acceptanceDate: '2025-01-22',
      acceptanceType: 'Provisional',
      phase: 'Installation Complete',
      deliverables: ['Cold Room Structure', 'Refrigeration System', 'Temperature Monitoring System', 'Installation & Commissioning'],
      acceptanceCriteria: [
        { id: 'CR-006', criterion: 'Temperature holding capacity -18°C', status: 'Met', remarks: 'Stable temperature achieved' },
        { id: 'CR-007', criterion: 'Humidity control functioning', status: 'Met', remarks: 'Humidity maintained at 60-70%' },
        { id: 'CR-008', criterion: 'Temperature uniformity test', status: 'Met', remarks: '±2°C variation across all zones' },
        { id: 'CR-009', criterion: 'Door sealing effectiveness', status: 'Partially Met', remarks: 'Minor air leakage detected - under rectification' },
        { id: 'CR-010', criterion: 'Alarm and monitoring system', status: 'Met', remarks: 'SMS and email alerts working' },
      ],
      totalCriteria: 5,
      criteriaMet: 4,
      criteriaPending: 1,
      documentation: [
        { id: 'DOC-006', documentName: 'Commissioning Report', status: 'Approved', submittedDate: '2025-01-20' },
        { id: 'DOC-007', documentName: 'Temperature Test Records', status: 'Approved', submittedDate: '2025-01-21' },
        { id: 'DOC-008', documentName: 'Equipment Warranties', status: 'Approved', submittedDate: '2025-01-21' },
        { id: 'DOC-009', documentName: 'Maintenance Manual', status: 'Submitted', submittedDate: '2025-01-22' },
      ],
      totalDocuments: 4,
      docsSubmitted: 4,
      docsPending: 0,
      defectsList: ['Minor air leakage at entry door gasket'],
      punchListItems: 1,
      completedPunchItems: 0,
      trainingCompleted: true,
      warrantyPeriod: '12 months',
      warrantyStartDate: '2025-01-22',
      amcOffered: true,
      amcDuration: '60 months',
      signedBy: 'Ms. Priya Menon',
      signedByDesignation: 'Supply Chain Head',
      signedDate: '2025-01-22',
      witnessedBy: 'Site Engineer - ManufacturingOS',
      overallStatus: 'Conditional',
      remarks: 'Provisional acceptance granted. Final acceptance subject to door gasket rectification within 7 days.',
      attachments: 8,
    },
    {
      id: 'CA-003',
      acceptanceNumber: 'ACC-2025-003',
      projectId: 'PRJ-2025-005',
      projectName: 'Godrej Properties - Modular Kitchen',
      projectType: 'Modular Kitchen',
      customer: 'Godrej Properties Limited',
      customerContact: 'Mr. Anil Desai',
      customerEmail: 'anil.desai@godrejproperties.com',
      acceptanceDate: '2025-01-23',
      acceptanceType: 'Final',
      phase: 'Project Handover',
      deliverables: ['Base Cabinets', 'Wall Cabinets', 'Tall Units', 'Countertop', 'Kitchen Appliances', 'Accessories'],
      acceptanceCriteria: [
        { id: 'CR-011', criterion: 'Finish quality as per sample', status: 'Met', remarks: 'Premium finish matching approved sample' },
        { id: 'CR-012', criterion: 'Hardware functionality', status: 'Met', remarks: 'All soft-close mechanisms working' },
        { id: 'CR-013', criterion: 'Appliances operational', status: 'Met', remarks: 'Hob, chimney, oven all tested' },
        { id: 'CR-014', criterion: 'Plumbing connections leak-free', status: 'Met', remarks: 'No leaks detected' },
        { id: 'CR-015', criterion: 'Electrical points functional', status: 'Met', remarks: 'All power points working' },
      ],
      totalCriteria: 5,
      criteriaMet: 5,
      criteriaPending: 0,
      documentation: [
        { id: 'DOC-010', documentName: 'Installation Certificate', status: 'Approved', submittedDate: '2025-01-22' },
        { id: 'DOC-011', documentName: 'Appliance Warranties', status: 'Approved', submittedDate: '2025-01-22' },
        { id: 'DOC-012', documentName: 'Usage Guidelines', status: 'Approved', submittedDate: '2025-01-23' },
      ],
      totalDocuments: 3,
      docsSubmitted: 3,
      docsPending: 0,
      defectsList: [],
      punchListItems: 2,
      completedPunchItems: 2,
      trainingCompleted: false,
      warrantyPeriod: '60 months',
      warrantyStartDate: '2025-01-23',
      amcOffered: false,
      amcDuration: '',
      signedBy: 'Mr. Anil Desai',
      signedByDesignation: 'Project Manager',
      signedDate: '2025-01-23',
      witnessedBy: 'Installation Team Lead',
      overallStatus: 'Accepted',
      remarks: 'Excellent workmanship. Client very satisfied with the quality and finish. Recommended for future projects.',
      attachments: 6,
    },
    {
      id: 'CA-004',
      acceptanceNumber: 'ACC-2025-004',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      projectType: 'Commercial Kitchen',
      customer: 'Indian Hotels Company Limited',
      customerContact: 'Mr. Suresh Nair',
      customerEmail: 'suresh.nair@tajhotels.com',
      acceptanceDate: '2025-01-24',
      acceptanceType: 'Partial',
      phase: 'Phase 1 Complete',
      deliverables: ['Cooking Section - Ranges and Ovens', 'Preparation Area - Tables and Sinks', 'Exhaust System - Hoods and Ducting'],
      acceptanceCriteria: [
        { id: 'CR-016', criterion: 'Cooking equipment commissioned', status: 'Met', remarks: 'All ranges and ovens operational' },
        { id: 'CR-017', criterion: 'SS work quality standard', status: 'Met', remarks: 'High quality stainless steel work' },
        { id: 'CR-018', criterion: 'Ventilation system operational', status: 'Partially Met', remarks: 'Working but noise level slightly high' },
        { id: 'CR-019', criterion: 'Gas connections certified', status: 'Met', remarks: 'Gas safety certificate obtained' },
        { id: 'CR-020', criterion: 'Fire suppression system', status: 'Not Met', remarks: 'Installation pending - Phase 2' },
      ],
      totalCriteria: 5,
      criteriaMet: 3,
      criteriaPending: 2,
      documentation: [
        { id: 'DOC-013', documentName: 'Phase 1 Completion Report', status: 'Approved', submittedDate: '2025-01-23' },
        { id: 'DOC-014', documentName: 'Equipment Commissioning Certificates', status: 'Approved', submittedDate: '2025-01-23' },
        { id: 'DOC-015', documentName: 'Gas Safety Certificate', status: 'Approved', submittedDate: '2025-01-24' },
        { id: 'DOC-016', documentName: 'Fire System Design', status: 'Pending', submittedDate: '' },
      ],
      totalDocuments: 4,
      docsSubmitted: 3,
      docsPending: 1,
      defectsList: ['Exhaust fan noise level 68dB (spec: max 65dB)', 'Fire suppression system pending'],
      punchListItems: 5,
      completedPunchItems: 3,
      trainingCompleted: false,
      warrantyPeriod: '24 months',
      warrantyStartDate: '2025-02-15',
      amcOffered: true,
      amcDuration: '36 months',
      signedBy: 'Mr. Suresh Nair',
      signedByDesignation: 'Executive Chef',
      signedDate: '2025-01-24',
      witnessedBy: 'Project Manager - ManufacturingOS',
      overallStatus: 'Conditional',
      remarks: 'Phase 1 accepted with conditions. Fan noise to be reduced. Fire system to be completed in Phase 2 by Feb 15.',
      attachments: 10,
    },
    {
      id: 'CA-005',
      acceptanceNumber: 'ACC-2025-005',
      projectId: 'PRJ-2025-003',
      projectName: 'L&T Campus - Industrial Kitchen',
      projectType: 'Industrial Kitchen',
      customer: 'Larsen & Toubro Limited',
      customerContact: 'Mr. Venkatesh Iyer',
      customerEmail: 'venkatesh.iyer@lnt.com',
      acceptanceDate: '',
      acceptanceType: 'Final',
      phase: 'Under Review',
      deliverables: ['Complete Kitchen Setup', 'Serving Counters', 'Dishwashing Area', 'Storage Facilities', 'HVAC System'],
      acceptanceCriteria: [
        { id: 'CR-021', criterion: 'Capacity for 2000 meals/day', status: 'Met', remarks: 'Trial run successful' },
        { id: 'CR-022', criterion: 'Equipment installation complete', status: 'Met', remarks: 'All equipment installed' },
        { id: 'CR-023', criterion: 'HVAC performance', status: 'Partially Met', remarks: 'Duct leakage issue being rectified' },
        { id: 'CR-024', criterion: 'Water and drainage systems', status: 'Met', remarks: 'All systems functional' },
        { id: 'CR-025', criterion: 'Health department approval', status: 'Not Met', remarks: 'Inspection scheduled next week' },
      ],
      totalCriteria: 5,
      criteriaMet: 3,
      criteriaPending: 2,
      documentation: [
        { id: 'DOC-017', documentName: 'Completion Certificate', status: 'Pending', submittedDate: '' },
        { id: 'DOC-018', documentName: 'Test Run Report', status: 'Submitted', submittedDate: '2025-01-22' },
        { id: 'DOC-019', documentName: 'Equipment Manuals', status: 'Submitted', submittedDate: '2025-01-22' },
        { id: 'DOC-020', documentName: 'Health Clearance', status: 'Pending', submittedDate: '' },
      ],
      totalDocuments: 4,
      docsSubmitted: 2,
      docsPending: 2,
      defectsList: ['HVAC duct leakage 5.2% (spec: max 3%)', 'Health department approval pending'],
      punchListItems: 8,
      completedPunchItems: 6,
      trainingCompleted: true,
      warrantyPeriod: '18 months',
      warrantyStartDate: '',
      amcOffered: true,
      amcDuration: '48 months',
      signedBy: '',
      signedByDesignation: '',
      signedDate: '',
      witnessedBy: '',
      overallStatus: 'Pending',
      remarks: 'Awaiting HVAC rectification and health department inspection. Acceptance review scheduled for Jan 30.',
      attachments: 14,
    },
    {
      id: 'CA-006',
      acceptanceNumber: 'ACC-2025-006',
      projectId: 'PRJ-2025-006',
      projectName: 'Siemens - Switchgear Manufacturing Unit',
      projectType: 'Switchgear',
      customer: 'Siemens Limited',
      customerContact: 'Mr. Klaus Mueller',
      customerEmail: 'klaus.mueller@siemens.com',
      acceptanceDate: '',
      acceptanceType: 'Provisional',
      phase: 'Testing Phase',
      deliverables: ['Switchgear Assembly Line', 'Testing Equipment', 'ESD Flooring', 'Clean Room Setup', 'Safety Systems'],
      acceptanceCriteria: [
        { id: 'CR-026', criterion: 'Assembly line operational', status: 'Met', remarks: 'Production line running' },
        { id: 'CR-027', criterion: 'Testing equipment calibrated', status: 'Partially Met', remarks: 'Calibration certificates for 3 items pending' },
        { id: 'CR-028', criterion: 'ESD flooring compliance', status: 'Met', remarks: 'Resistance within specified limits' },
        { id: 'CR-029', criterion: 'Clean room classification', status: 'Not Met', remarks: 'Achieving Class 10000, target is Class 1000' },
        { id: 'CR-030', criterion: 'Safety interlocks functional', status: 'Met', remarks: 'All safety systems tested' },
      ],
      totalCriteria: 5,
      criteriaMet: 3,
      criteriaPending: 2,
      documentation: [
        { id: 'DOC-021', documentName: 'Installation Drawings', status: 'Approved', submittedDate: '2025-01-20' },
        { id: 'DOC-022', documentName: 'Equipment Manuals', status: 'Submitted', submittedDate: '2025-01-21' },
        { id: 'DOC-023', documentName: 'Calibration Certificates', status: 'Pending', submittedDate: '' },
        { id: 'DOC-024', documentName: 'Clean Room Test Report', status: 'Rejected', submittedDate: '2025-01-22' },
      ],
      totalDocuments: 4,
      docsSubmitted: 2,
      docsPending: 2,
      defectsList: ['Clean room not meeting Class 1000 specification', 'Calibration certificates pending for 3 test equipment'],
      punchListItems: 12,
      completedPunchItems: 8,
      trainingCompleted: false,
      warrantyPeriod: '12 months',
      warrantyStartDate: '',
      amcOffered: true,
      amcDuration: '60 months',
      signedBy: '',
      signedByDesignation: '',
      signedDate: '',
      witnessedBy: '',
      overallStatus: 'Pending',
      remarks: 'Critical: Clean room filtration to be upgraded. Calibration to be completed. Re-inspection in 2 weeks.',
      attachments: 18,
    },
    {
      id: 'CA-007',
      acceptanceNumber: 'ACC-2025-007',
      projectId: 'PRJ-2025-007',
      projectName: 'Reliance Retail - Cold Storage',
      projectType: 'Cold Room',
      customer: 'Reliance Retail Limited',
      customerContact: 'Mr. Amit Patel',
      customerEmail: 'amit.patel@ril.com',
      acceptanceDate: '',
      acceptanceType: 'Final',
      phase: 'Awaiting Handover',
      deliverables: ['Multi-zone Cold Storage', 'Racking System', 'Material Handling Equipment', 'Monitoring System'],
      acceptanceCriteria: [
        { id: 'CR-031', criterion: 'Temperature zones -18°C, -5°C, +2°C', status: 'Not Met', remarks: 'Still under commissioning' },
        { id: 'CR-032', criterion: 'Racking load capacity 500kg/pallet', status: 'Not Met', remarks: 'Load test scheduled' },
        { id: 'CR-033', criterion: 'Forklift operation clearances', status: 'Not Met', remarks: 'Not yet tested' },
        { id: 'CR-034', criterion: 'Monitoring system integration', status: 'Not Met', remarks: 'Software installation pending' },
        { id: 'CR-035', criterion: 'Backup power system', status: 'Not Met', remarks: 'DG commissioning pending' },
      ],
      totalCriteria: 5,
      criteriaMet: 0,
      criteriaPending: 5,
      documentation: [
        { id: 'DOC-025', documentName: 'Design Approval', status: 'Approved', submittedDate: '2025-01-10' },
        { id: 'DOC-026', documentName: 'Material Test Certificates', status: 'Pending', submittedDate: '' },
        { id: 'DOC-027', documentName: 'Commissioning Plan', status: 'Pending', submittedDate: '' },
      ],
      totalDocuments: 3,
      docsSubmitted: 1,
      docsPending: 2,
      defectsList: ['Project delayed - civil work incomplete', 'Power connection pending from utility'],
      punchListItems: 0,
      completedPunchItems: 0,
      trainingCompleted: false,
      warrantyPeriod: '12 months',
      warrantyStartDate: '',
      amcOffered: true,
      amcDuration: '60 months',
      signedBy: '',
      signedByDesignation: '',
      signedDate: '',
      witnessedBy: '',
      overallStatus: 'Pending',
      remarks: 'Project behind schedule. Civil work to be completed before acceptance testing can begin. Revised acceptance date: Feb 20.',
      attachments: 0,
    },
    {
      id: 'CA-008',
      acceptanceNumber: 'ACC-2025-008',
      projectId: 'PRJ-2025-008',
      projectName: 'Marriott Hotel - Kitchen Renovation',
      projectType: 'Commercial Kitchen',
      customer: 'Marriott International',
      customerContact: 'Ms. Sarah Williams',
      customerEmail: 'sarah.williams@marriott.com',
      acceptanceDate: '',
      acceptanceType: 'Partial',
      phase: 'Phase 1 - Prep Area',
      deliverables: ['Preparation Section', 'Refrigeration Units', 'Wash Area Upgrade'],
      acceptanceCriteria: [
        { id: 'CR-036', criterion: 'Work during non-peak hours only', status: 'Met', remarks: 'All work done 11 PM to 6 AM' },
        { id: 'CR-037', criterion: 'No disruption to hotel operations', status: 'Met', remarks: 'Zero complaints received' },
        { id: 'CR-038', criterion: 'Equipment operational for breakfast', status: 'Met', remarks: 'Kitchen ready by 6 AM daily' },
        { id: 'CR-039', criterion: 'Noise control compliance', status: 'Met', remarks: 'Noise levels within limits' },
        { id: 'CR-040', criterion: 'Phase 1 deliverables complete', status: 'Partially Met', remarks: 'One refrigeration unit pending delivery' },
      ],
      totalCriteria: 5,
      criteriaMet: 4,
      criteriaPending: 1,
      documentation: [
        { id: 'DOC-028', documentName: 'Phase 1 Report', status: 'Submitted', submittedDate: '2025-01-23' },
        { id: 'DOC-029', documentName: 'Equipment Certificates', status: 'Submitted', submittedDate: '2025-01-23' },
        { id: 'DOC-030', documentName: 'Safety Compliance', status: 'Approved', submittedDate: '2025-01-22' },
      ],
      totalDocuments: 3,
      docsSubmitted: 3,
      docsPending: 0,
      defectsList: ['One refrigeration unit delayed - supplier issue'],
      punchListItems: 4,
      completedPunchItems: 3,
      trainingCompleted: true,
      warrantyPeriod: '18 months',
      warrantyStartDate: '',
      amcOffered: true,
      amcDuration: '36 months',
      signedBy: '',
      signedByDesignation: '',
      signedDate: '',
      witnessedBy: '',
      overallStatus: 'Conditional',
      remarks: 'Phase 1 nearly complete. Excellent coordination. Delayed refrigeration unit expected by Jan 28. Phase 2 to start Feb 1.',
      attachments: 7,
    },
  ];

  const stats = {
    totalAcceptances: mockAcceptances.length,
    accepted: mockAcceptances.filter(a => a.overallStatus === 'Accepted').length,
    conditional: mockAcceptances.filter(a => a.overallStatus === 'Conditional').length,
    pending: mockAcceptances.filter(a => a.overallStatus === 'Pending').length,
    rejected: mockAcceptances.filter(a => a.overallStatus === 'Rejected').length,
    totalPunchItems: mockAcceptances.reduce((sum, a) => sum + a.punchListItems, 0),
    completedPunchItems: mockAcceptances.reduce((sum, a) => sum + a.completedPunchItems, 0),
  };

  const filteredAcceptances = mockAcceptances.filter((acceptance) => {
    const matchesSearch =
      acceptance.acceptanceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acceptance.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acceptance.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || acceptance.overallStatus === filterStatus;
    const matchesType = filterType === 'all' || acceptance.acceptanceType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredAcceptances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAcceptances = filteredAcceptances.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Conditional':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriteriaStatusColor = (status: string) => {
    switch (status) {
      case 'Met':
        return 'text-green-600';
      case 'Not Met':
        return 'text-red-600';
      case 'Partially Met':
        return 'text-yellow-600';
      case 'Waived':
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  };

  const getCriteriaStatusIcon = (status: string) => {
    switch (status) {
      case 'Met':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Not Met':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'Partially Met':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'Waived':
        return <span className="text-gray-400 text-xs">WAIVED</span>;
      default:
        return null;
    }
  };

  const handleSchedule = (data: any) => { console.log('Schedule:', data); setShowScheduleModal(false); };
  const handleEdit = (data: any) => { console.log('Edit:', data); setShowEditModal(false); setSelectedAcceptance(null); };
  const handleUpdateCriteria = (data: any) => { console.log('Update Criteria:', data); setShowUpdateCriteriaModal(false); setSelectedAcceptance(null); };
  const handleUpdateDocumentation = (data: any) => { console.log('Update Documentation:', data); setShowUpdateDocumentationModal(false); setSelectedAcceptance(null); };
  const handleAddPunchList = (data: any) => { console.log('Add Punch List:', data); setShowAddPunchListModal(false); setSelectedAcceptance(null); };
  const handleUpdateTraining = (data: any) => { console.log('Update Training:', data); setShowUpdateTrainingModal(false); setSelectedAcceptance(null); };
  const handleUpdateWarranty = (data: any) => { console.log('Update Warranty:', data); setShowUpdateWarrantyModal(false); setSelectedAcceptance(null); };
  const handleSign = (data: any) => { console.log('Sign:', data); setShowSignModal(false); setSelectedAcceptance(null); };
  const handleUpdateStatus = (data: any) => { console.log('Update Status:', data); setShowUpdateStatusModal(false); setSelectedAcceptance(null); };
  const handleUploadAttachments = (data: any) => { console.log('Upload Attachments:', data); setShowUploadAttachmentsModal(false); setSelectedAcceptance(null); };
  const handleGenerateReport = (data: any) => { console.log('Generate Report:', data); setShowGenerateReportModal(false); };
  const openEditModal = (a: CustomerAcceptance) => { setSelectedAcceptance(a); setShowEditModal(true); };
  const openUpdateCriteriaModal = (a: CustomerAcceptance) => { setSelectedAcceptance(a); setShowUpdateCriteriaModal(true); };
  const openUpdateDocumentationModal = (a: CustomerAcceptance) => { setSelectedAcceptance(a); setShowUpdateDocumentationModal(true); };
  const openAddPunchListModal = (a: CustomerAcceptance) => { setSelectedAcceptance(a); setShowAddPunchListModal(true); };
  const openUpdateTrainingModal = (a: CustomerAcceptance) => { setSelectedAcceptance(a); setShowUpdateTrainingModal(true); };
  const openUpdateWarrantyModal = (a: CustomerAcceptance) => { setSelectedAcceptance(a); setShowUpdateWarrantyModal(true); };
  const openSignModal = (a: CustomerAcceptance) => { setSelectedAcceptance(a); setShowSignModal(true); };
  const openUpdateStatusModal = (a: CustomerAcceptance) => { setSelectedAcceptance(a); setShowUpdateStatusModal(true); };
  const openUploadAttachmentsModal = (a: CustomerAcceptance) => { setSelectedAcceptance(a); setShowUploadAttachmentsModal(true); };
  const openViewFullDetailsModal = (a: CustomerAcceptance) => { setSelectedAcceptance(a); setShowViewFullDetailsModal(true); };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Action Bar */}
          <div className="flex justify-end items-center space-x-3">
            <button onClick={() => setShowGenerateReportModal(true)} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <FileOutput className="h-5 w-5" />
              <span>Generate Report</span>
            </button>
            <button onClick={() => setShowScheduleModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-5 w-5" />
              <span>New Acceptance</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAcceptances}</p>
            </div>
            <FileCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conditional</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.conditional}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Punch Items</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalPunchItems}</p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedPunchItems}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by acceptance number, project, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Accepted">Accepted</option>
              <option value="Conditional">Conditional</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Provisional">Provisional</option>
              <option value="Final">Final</option>
              <option value="Partial">Partial</option>
              <option value="Conditional">Conditional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Acceptances Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedAcceptances.map((acceptance) => (
          <div key={acceptance.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-gray-900">{acceptance.acceptanceNumber}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(acceptance.overallStatus)}`}>
                    {acceptance.overallStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{acceptance.projectId} - {acceptance.acceptanceType}</p>
              </div>
              <button
                onClick={() => setSelectedAcceptance(acceptance)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>

            {/* Project & Customer Info */}
            <div className="mb-4">
              <p className="font-medium text-gray-900">{acceptance.projectName}</p>
              <p className="text-sm text-gray-600">{acceptance.customer}</p>
              <p className="text-xs text-gray-500">{acceptance.customerContact}</p>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Acceptance Criteria</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(acceptance.criteriaMet / acceptance.totalCriteria) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {acceptance.criteriaMet}/{acceptance.totalCriteria}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Documentation</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(acceptance.docsSubmitted / acceptance.totalDocuments) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {acceptance.docsSubmitted}/{acceptance.totalDocuments}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Punch List</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: acceptance.punchListItems > 0 ? `${(acceptance.completedPunchItems / acceptance.punchListItems) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {acceptance.completedPunchItems}/{acceptance.punchListItems}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Training</p>
                <div className="flex items-center space-x-2 mt-1">
                  {acceptance.trainingCompleted ? (
                    <span className="flex items-center text-sm font-semibold text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center text-sm font-semibold text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Defects List */}
            {acceptance.defectsList.length > 0 && (
              <div className="mb-4 bg-red-50 border border-red-200 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">{acceptance.defectsList.length} Defects</span>
                </div>
                <ul className="space-y-1">
                  {acceptance.defectsList.slice(0, 2).map((defect, index) => (
                    <li key={index} className="text-xs text-red-700">• {defect}</li>
                  ))}
                  {acceptance.defectsList.length > 2 && (
                    <li className="text-xs text-red-600 font-medium">+ {acceptance.defectsList.length - 2} more...</li>
                  )}
                </ul>
              </div>
            )}

            {/* Sign-off Status */}
            {acceptance.signedDate ? (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Signed Off</span>
                </div>
                <p className="text-xs text-green-700">
                  By {acceptance.signedBy} ({acceptance.signedByDesignation}) on {acceptance.signedDate}
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-800">Awaiting Sign-off</span>
                </div>
              </div>
            )}

            {/* Warranty & AMC */}
            {acceptance.warrantyPeriod && (
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-500">Warranty</p>
                  <p className="font-medium text-gray-900">{acceptance.warrantyPeriod}</p>
                </div>
                {acceptance.amcOffered && (
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">AMC Offered</p>
                    <p className="font-medium text-gray-900">{acceptance.amcDuration}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600 line-clamp-2 flex-1">{acceptance.remarks}</p>
              </div>
              <div className="flex items-center space-x-1 flex-wrap gap-1">
                <button onClick={() => openViewFullDetailsModal(acceptance)} className="p-1.5 bg-gray-50 text-gray-700 rounded hover:bg-gray-100" title="View Details"><Eye className="h-4 w-4" /></button>
                <button onClick={() => openEditModal(acceptance)} className="p-1.5 bg-green-50 text-green-700 rounded hover:bg-green-100" title="Edit"><Edit className="h-4 w-4" /></button>
                <button onClick={() => openUpdateCriteriaModal(acceptance)} className="p-1.5 bg-purple-50 text-purple-700 rounded hover:bg-purple-100" title="Update Criteria"><ListChecks className="h-4 w-4" /></button>
                <button onClick={() => openUpdateDocumentationModal(acceptance)} className="p-1.5 bg-orange-50 text-orange-700 rounded hover:bg-orange-100" title="Documentation"><FileStack className="h-4 w-4" /></button>
                <button onClick={() => openAddPunchListModal(acceptance)} className="p-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100" title="Punch List"><Wrench className="h-4 w-4" /></button>
                <button onClick={() => openUpdateTrainingModal(acceptance)} className="p-1.5 bg-teal-50 text-teal-700 rounded hover:bg-teal-100" title="Training"><GraduationCap className="h-4 w-4" /></button>
                <button onClick={() => openUpdateWarrantyModal(acceptance)} className="p-1.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100" title="Warranty"><Shield className="h-4 w-4" /></button>
                <button onClick={() => openSignModal(acceptance)} className="p-1.5 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100" title="Sign"><PenTool className="h-4 w-4" /></button>
                <button onClick={() => openUpdateStatusModal(acceptance)} className="p-1.5 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100" title="Update Status"><RefreshCw className="h-4 w-4" /></button>
                <button onClick={() => openUploadAttachmentsModal(acceptance)} className="p-1.5 bg-cyan-50 text-cyan-700 rounded hover:bg-cyan-100" title="Upload"><Upload className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredAcceptances.length)}</span> of{' '}
            <span className="font-medium">{filteredAcceptances.length}</span> acceptances
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

      {/* View Details Modal */}
      {selectedAcceptance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedAcceptance.acceptanceNumber}</h2>
                <p className="text-sm text-gray-600">{selectedAcceptance.projectName}</p>
              </div>
              <button
                onClick={() => setSelectedAcceptance(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Deliverables */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deliverables</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAcceptance.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acceptance Criteria */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Acceptance Criteria</h3>
                <div className="space-y-3">
                  {selectedAcceptance.acceptanceCriteria.map((criterion, index) => (
                    <div key={criterion.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {index + 1}. {criterion.criterion}
                          </p>
                          {criterion.remarks && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Remarks:</span> {criterion.remarks}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getCriteriaStatusIcon(criterion.status)}
                          <span className={`font-semibold text-sm ${getCriteriaStatusColor(criterion.status)}`}>
                            {criterion.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Documentation</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-600">Document</th>
                        <th className="px-4 py-2 text-left text-gray-600">Status</th>
                        <th className="px-4 py-2 text-left text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedAcceptance.documentation.map((doc) => (
                        <tr key={doc.id}>
                          <td className="px-4 py-2 text-gray-900">{doc.documentName}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              doc.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                              doc.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-600">{doc.submittedDate || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overall Remarks */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Overall Remarks</h3>
                <p className="text-sm text-gray-700">{selectedAcceptance.remarks}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download Certificate</span>
                </button>
                <button
                  onClick={() => setSelectedAcceptance(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ScheduleAcceptanceModal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} onSchedule={handleSchedule} />
      <EditAcceptanceModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setSelectedAcceptance(null); }} onEdit={handleEdit} acceptance={selectedAcceptance} />
      <UpdateCriteriaModal isOpen={showUpdateCriteriaModal} onClose={() => { setShowUpdateCriteriaModal(false); setSelectedAcceptance(null); }} onUpdate={handleUpdateCriteria} acceptance={selectedAcceptance} />
      <UpdateDocumentationModal isOpen={showUpdateDocumentationModal} onClose={() => { setShowUpdateDocumentationModal(false); setSelectedAcceptance(null); }} onUpdate={handleUpdateDocumentation} acceptance={selectedAcceptance} />
      <AddPunchListItemsModal isOpen={showAddPunchListModal} onClose={() => { setShowAddPunchListModal(false); setSelectedAcceptance(null); }} onAdd={handleAddPunchList} acceptance={selectedAcceptance} />
      <UpdateTrainingStatusModal isOpen={showUpdateTrainingModal} onClose={() => { setShowUpdateTrainingModal(false); setSelectedAcceptance(null); }} onUpdate={handleUpdateTraining} acceptance={selectedAcceptance} />
      <UpdateWarrantyModal isOpen={showUpdateWarrantyModal} onClose={() => { setShowUpdateWarrantyModal(false); setSelectedAcceptance(null); }} onUpdate={handleUpdateWarranty} acceptance={selectedAcceptance} />
      <SignAcceptanceModal isOpen={showSignModal} onClose={() => { setShowSignModal(false); setSelectedAcceptance(null); }} onSign={handleSign} acceptance={selectedAcceptance} />
      <UpdateStatusModal isOpen={showUpdateStatusModal} onClose={() => { setShowUpdateStatusModal(false); setSelectedAcceptance(null); }} onUpdate={handleUpdateStatus} acceptance={selectedAcceptance} />
      <UploadAttachmentsModal isOpen={showUploadAttachmentsModal} onClose={() => { setShowUploadAttachmentsModal(false); setSelectedAcceptance(null); }} onUpload={handleUploadAttachments} acceptance={selectedAcceptance} />
      <GenerateReportModal isOpen={showGenerateReportModal} onClose={() => setShowGenerateReportModal(false)} onGenerate={handleGenerateReport} />
      <ViewFullDetailsModal isOpen={showViewFullDetailsModal} onClose={() => { setShowViewFullDetailsModal(false); setSelectedAcceptance(null); }} acceptance={selectedAcceptance} />
        </div>
      </div>
    </div>
  );
}
