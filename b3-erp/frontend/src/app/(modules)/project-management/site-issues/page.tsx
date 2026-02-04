'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp, Calendar, Users, Eye, Plus, Download, Edit, FileText, Upload, MessageSquare, Shield } from 'lucide-react';
import {
 ReportIssueModal,
 EditIssueModal,
 AssignIssueModal,
 UpdateStatusModal,
 AddRootCauseModal,
 AddSolutionModal,
 AddResolutionModal,
 AddPreventiveMeasuresModal,
 UploadAttachmentsModal,
 AddCommentsModal,
 GenerateReportModal,
 ViewFullDetailsModal,
} from '@/components/project-management/SiteIssuesModals';

interface SiteIssue {
 id: string;
 issueNumber: string;
 projectId: string;
 projectName: string;
 issueTitle: string;
 issueType: 'Safety' | 'Quality' | 'Technical' | 'Material' | 'Resource' | 'Schedule' | 'Client' | 'Other';
 severity: 'Critical' | 'High' | 'Medium' | 'Low';
 priority: 'P1' | 'P2' | 'P3' | 'P4';
 reportedDate: string;
 reportedBy: string;
 reportedByRole: string;
 location: string;
 description: string;
 impactOnWork: string;
 rootCause: string;
 proposedSolution: string;
 assignedTo: string;
 targetDate: string;
 actualResolutionDate: string;
 status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Reopened';
 resolutionDetails: string;
 costImpact: number;
 scheduleImpact: number;
 preventiveMeasures: string;
 attachments: number;
 relatedIssues: string[];
}

export default function SiteIssuesPage() {
 const [searchQuery, setSearchQuery] = useState('');
 const [filterStatus, setFilterStatus] = useState<string>('all');
 const [filterSeverity, setFilterSeverity] = useState<string>('all');
 const [filterType, setFilterType] = useState<string>('all');
 const [showAddModal, setShowAddModal] = useState(false);
 const [selectedIssue, setSelectedIssue] = useState<SiteIssue | null>(null);
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 10;

 // Modal states
 const [showReportModal, setShowReportModal] = useState(false);
 const [showEditModal, setShowEditModal] = useState(false);
 const [showAssignModal, setShowAssignModal] = useState(false);
 const [showStatusModal, setShowStatusModal] = useState(false);
 const [showRootCauseModal, setShowRootCauseModal] = useState(false);
 const [showSolutionModal, setShowSolutionModal] = useState(false);
 const [showResolutionModal, setShowResolutionModal] = useState(false);
 const [showPreventiveModal, setShowPreventiveModal] = useState(false);
 const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
 const [showCommentsModal, setShowCommentsModal] = useState(false);
 const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
 const [showDetailsModal, setShowDetailsModal] = useState(false);

 const mockIssues: SiteIssue[] = [
  {
   id: 'ISS-001',
   issueNumber: 'ISSUE-2025-001',
   projectId: 'PRJ-2025-001',
   projectName: 'Taj Hotels - Commercial Kitchen Setup',
   issueTitle: 'Gas Leak Detected at Main Supply Line',
   issueType: 'Safety',
   severity: 'Critical',
   priority: 'P1',
   reportedDate: '2025-01-22',
   reportedBy: 'Ramesh Kumar',
   reportedByRole: 'Site Supervisor',
   location: 'Main Kitchen - Cooking Section',
   description: 'Minor gas leak detected at main supply line connection point during routine safety inspection. Leak detected using soap solution test.',
   impactOnWork: 'All gas equipment usage halted immediately. Installation work stopped until leak is repaired.',
   rootCause: 'Improper thread sealing compound application on pipe joint',
   proposedSolution: 'Disassemble joint, clean threads, apply proper sealant, reassemble and pressure test',
   assignedTo: 'Prakash Rao (Plumbing Team)',
   targetDate: '2025-01-22',
   actualResolutionDate: '2025-01-22',
   status: 'Closed',
   resolutionDetails: 'Joint disassembled, threads cleaned and resealed with Teflon tape and thread sealant. Pressure tested and leak test passed. Gas supply restored.',
   costImpact: 5000,
   scheduleImpact: 0.5,
   preventiveMeasures: 'Enhanced quality check for all gas connections. Mandatory pressure and leak testing before gas supply activation.',
   attachments: 8,
   relatedIssues: [],
  },
  {
   id: 'ISS-002',
   issueNumber: 'ISSUE-2025-002',
   projectId: 'PRJ-2025-003',
   projectName: 'L&T Campus - Industrial Kitchen',
   issueTitle: 'HVAC Duct Leakage Above Acceptable Limits',
   issueType: 'Quality',
   severity: 'High',
   priority: 'P2',
   reportedDate: '2025-01-21',
   reportedBy: 'Vijay Sharma',
   reportedByRole: 'Project Manager',
   location: 'Cafeteria - Kitchen Area',
   description: 'Duct leakage test failed. Measured leakage of 5.2% at 250Pa pressure, exceeding specification of maximum 3% leakage.',
   impactOnWork: 'System cannot be commissioned until leaks are repaired. Delays handover by 3 days.',
   rootCause: 'Improper sealing at 2 duct joints and one damaged joint connection',
   proposedSolution: 'Identify and repair all leak points. Re-seal joints with mastic sealant. Replace damaged joint section.',
   assignedTo: 'Anil Joshi (HVAC Team)',
   targetDate: '2025-01-24',
   actualResolutionDate: '2025-01-23',
   status: 'Closed',
   resolutionDetails: 'All leak points identified and repaired. Joints resealed with approved mastic. Damaged section replaced. Re-tested with leakage at 2.1% - within specification.',
   costImpact: 25000,
   scheduleImpact: 3,
   preventiveMeasures: 'Implement progressive leak testing during duct installation. Enhanced supervision of duct sealing work.',
   attachments: 12,
   relatedIssues: [],
  },
  {
   id: 'ISS-003',
   issueNumber: 'ISSUE-2025-003',
   projectId: 'PRJ-2025-002',
   projectName: 'BigBasket - Cold Room Installation',
   issueTitle: 'Refrigerant Gas Shortage',
   issueType: 'Material',
   severity: 'High',
   priority: 'P2',
   reportedDate: '2025-01-23',
   reportedBy: 'Venkat Rao',
   reportedByRole: 'Refrigeration Engineer',
   location: 'Warehouse - Cold Storage Area',
   description: 'Insufficient R404A refrigerant gas available on site. Required 95kg but only 80kg in stock. Cannot complete gas charging.',
   impactOnWork: 'Refrigeration system commissioning delayed by 1 day awaiting additional gas supply.',
   rootCause: 'Longer than expected pipe runs required additional refrigerant. Initial calculation underestimated requirement.',
   proposedSolution: 'Emergency procurement of additional 20kg R404A refrigerant from local supplier',
   assignedTo: 'Suresh Patel (Procurement)',
   targetDate: '2025-01-24',
   actualResolutionDate: '2025-01-24',
   status: 'Closed',
   resolutionDetails: 'Additional 20kg R404A procured from authorized dealer. Gas charging completed. System commissioned successfully.',
   costImpact: 24000,
   scheduleImpact: 1,
   preventiveMeasures: 'Revise refrigerant calculation method to include 15% buffer. Maintain emergency stock of common refrigerants.',
   attachments: 4,
   relatedIssues: [],
  },
  {
   id: 'ISS-004',
   issueNumber: 'ISSUE-2025-004',
   projectId: 'PRJ-2025-001',
   projectName: 'Taj Hotels - Commercial Kitchen Setup',
   issueTitle: 'Client Requested Design Modification',
   issueType: 'Client',
   severity: 'Medium',
   priority: 'P3',
   reportedDate: '2025-01-18',
   reportedBy: 'Ramesh Kumar',
   reportedByRole: 'Project Manager',
   location: 'Main Kitchen - Prep Area',
   description: 'Client requested to relocate hand wash basin by 2 meters for better ergonomic accessibility and compliance with FSSAI guidelines.',
   impactOnWork: 'Minor rework required for plumbing connections. Some SS cladding work needs adjustment.',
   rootCause: 'Design finalized without client walkthrough at prep area location',
   proposedSolution: 'Submit change order. Relocate basin as per client requirement. Extend plumbing lines.',
   assignedTo: 'Dinesh Kumar (Installation Team)',
   targetDate: '2025-01-25',
   actualResolutionDate: '2025-01-24',
   status: 'Closed',
   resolutionDetails: 'Change order approved. Basin relocated to new position. Plumbing extended and tested. SS cladding adjusted. Client satisfied.',
   costImpact: 35000,
   scheduleImpact: 2,
   preventiveMeasures: 'Mandatory client walkthrough and sign-off before finalizing prep area installations in future projects.',
   attachments: 3,
   relatedIssues: ['CHG-2025-004'],
  },
  {
   id: 'ISS-005',
   issueNumber: 'ISSUE-2025-005',
   projectId: 'PRJ-2025-006',
   projectName: 'Siemens - Switchgear Manufacturing Unit',
   issueTitle: 'Clean Room Filtration Not Meeting Specification',
   issueType: 'Technical',
   severity: 'Critical',
   priority: 'P1',
   reportedDate: '2025-01-20',
   reportedBy: 'Mahesh Gupta',
   reportedByRole: 'Quality Engineer',
   location: 'Factory - Assembly Bay',
   description: 'Clean room classification test shows Class 10000 cleanliness level. Client specification requires Class 1000 level.',
   impactOnWork: 'Clean room cannot be accepted until meeting specification. Major rectification required.',
   rootCause: 'Initial design used Class 10000 HEPA filters instead of Class 1000 specifications',
   proposedSolution: 'Upgrade to higher efficiency HEPA filters (H14 grade). Increase air change rate. Install additional pre-filters.',
   assignedTo: 'Deepak Shah (HVAC Team)',
   targetDate: '2025-02-05',
   actualResolutionDate: '',
   status: 'In Progress',
   resolutionDetails: 'H14 HEPA filters ordered. Delivery expected by Jan 28. Installation and retesting to follow.',
   costImpact: 1200000,
   scheduleImpact: 21,
   preventiveMeasures: 'Implement design review checklist with client technical team. Verify all specifications against actual procurement.',
   attachments: 15,
   relatedIssues: ['CHG-2025-007'],
  },
  {
   id: 'ISS-006',
   issueNumber: 'ISSUE-2025-006',
   projectId: 'PRJ-2025-005',
   projectName: 'Godrej Properties - Modular Kitchen',
   issueTitle: 'Cabinet Drawer Soft-Close Mechanism Malfunction',
   issueType: 'Quality',
   severity: 'Low',
   priority: 'P4',
   reportedDate: '2025-01-20',
   reportedBy: 'Ravi Shankar',
   reportedByRole: 'Installation Supervisor',
   location: 'Sample Flat - Kitchen',
   description: 'One cabinet drawer soft-close mechanism not functioning properly. Drawer closes with slight impact.',
   impactOnWork: 'Minor issue. Does not affect overall installation progress.',
   rootCause: 'Defective soft-close damper in one drawer slide',
   proposedSolution: 'Replace drawer slide with soft-close mechanism from spare stock',
   assignedTo: 'Sanjay Gupta (Carpentry Team)',
   targetDate: '2025-01-22',
   actualResolutionDate: '2025-01-21',
   status: 'Closed',
   resolutionDetails: 'Defective drawer slide replaced with new Blum soft-close slide from stock. Mechanism tested and working smoothly. Client verified.',
   costImpact: 3500,
   scheduleImpact: 0,
   preventiveMeasures: 'Test all soft-close mechanisms during installation before final handover.',
   attachments: 2,
   relatedIssues: [],
  },
  {
   id: 'ISS-007',
   issueNumber: 'ISSUE-2025-007',
   projectId: 'PRJ-2025-003',
   projectName: 'L&T Campus - Industrial Kitchen',
   issueTitle: 'Skilled Labor Shortage',
   issueType: 'Resource',
   severity: 'Medium',
   priority: 'P3',
   reportedDate: '2025-01-17',
   reportedBy: 'Vijay Sharma',
   reportedByRole: 'Project Manager',
   location: 'Cafeteria - All Areas',
   description: '3 skilled welders absent due to medical emergency. Critical welding work for SS fabrication delayed.',
   impactOnWork: 'SS fabrication work delayed by 2 days. Risk of impacting critical path.',
   rootCause: 'No backup team available for skilled welding work',
   proposedSolution: 'Deploy skilled welders from another project temporarily. Authorize overtime to cover lost time.',
   assignedTo: 'HR Department',
   targetDate: '2025-01-18',
   actualResolutionDate: '2025-01-18',
   status: 'Closed',
   resolutionDetails: '2 skilled welders deployed from completed project. Work resumed. Overtime authorized for 2 days to cover delay. Work back on schedule.',
   costImpact: 15000,
   scheduleImpact: 0,
   preventiveMeasures: 'Maintain list of backup skilled workers from manpower agencies. Implement multi-skilling program.',
   attachments: 1,
   relatedIssues: [],
  },
  {
   id: 'ISS-008',
   issueNumber: 'ISSUE-2025-008',
   projectId: 'PRJ-2025-004',
   projectName: 'ITC Grand - Bakery Equipment Setup',
   issueTitle: 'Power Supply Interruption',
   issueType: 'Technical',
   severity: 'Medium',
   priority: 'P3',
   reportedDate: '2025-01-16',
   reportedBy: 'Amit Singh',
   reportedByRole: 'Site Engineer',
   location: 'Bakery - Baking Section',
   description: 'Frequent power fluctuations and 2 complete power failures during oven commissioning tests.',
   impactOnWork: 'Cannot complete oven calibration and baking tests. Risk of equipment damage.',
   rootCause: 'Inadequate power supply stabilization. Hotel DG switchover causing voltage dips.',
   proposedSolution: 'Install voltage stabilizer for bakery equipment. Coordinate with hotel for stable power during testing.',
   assignedTo: 'Electrical Team',
   targetDate: '2025-01-17',
   actualResolutionDate: '2025-01-17',
   status: 'Closed',
   resolutionDetails: 'Industrial voltage stabilizer installed for bakery section. Hotel engineering provided dedicated power line during testing hours. Commissioning completed successfully.',
   costImpact: 45000,
   scheduleImpact: 1,
   preventiveMeasures: 'Survey site power quality before equipment installation. Install stabilizers proactively if power quality issues expected.',
   attachments: 5,
   relatedIssues: [],
  },
  {
   id: 'ISS-009',
   issueNumber: 'ISSUE-2025-009',
   projectId: 'PRJ-2025-008',
   projectName: 'Marriott Hotel - Kitchen Renovation',
   issueTitle: 'Access Restriction During Hotel Operations',
   issueType: 'Schedule',
   severity: 'High',
   priority: 'P2',
   reportedDate: '2025-01-19',
   reportedBy: 'Naveen Kumar',
   reportedByRole: 'Site Coordinator',
   location: 'Kitchen - All Areas',
   description: 'Hotel management restricting site access during breakfast and dinner service hours (6-11 AM, 6-11 PM). Only 6 hours daily access available.',
   impactOnWork: 'Severely impacts productivity. Work scope requires 8-10 hours daily. Schedule at risk.',
   rootCause: 'Hotel operational constraints not fully communicated during project planning',
   proposedSolution: 'Negotiate night shift work (11 PM to 6 AM). Pre-fabricate maximum components off-site. Increase team size.',
   assignedTo: 'Management',
   targetDate: '2025-01-22',
   actualResolutionDate: '2025-01-21',
   status: 'Resolved',
   resolutionDetails: 'Agreement reached with hotel for night shift work 11 PM to 6 AM. Additional compensation approved. Team size increased. Off-site pre-fabrication initiated.',
   costImpact: 180000,
   scheduleImpact: 0,
   preventiveMeasures: 'Detailed site access survey before bidding. Include operational constraint clauses in contract. Plan for night shift work in operational facilities.',
   attachments: 6,
   relatedIssues: [],
  },
  {
   id: 'ISS-010',
   issueNumber: 'ISSUE-2025-010',
   projectId: 'PRJ-2025-001',
   projectName: 'Taj Hotels - Commercial Kitchen Setup',
   issueTitle: 'Material Damage During Transportation',
   issueType: 'Material',
   severity: 'Medium',
   priority: 'P3',
   reportedDate: '2025-01-14',
   reportedBy: 'Ramesh Kumar',
   reportedByRole: 'Site Supervisor',
   location: 'Site Warehouse',
   description: 'One SS work table delivered with dented top surface and one corner leg bent. Not acceptable for installation.',
   impactOnWork: 'Cannot install damaged table. Replacement required. Prep area work delayed.',
   rootCause: 'Inadequate packaging and improper handling during transportation',
   proposedSolution: 'Return damaged unit to factory. Expedite replacement. Claim insurance for damaged goods.',
   assignedTo: 'Procurement Team',
   targetDate: '2025-01-20',
   actualResolutionDate: '2025-01-19',
   status: 'Closed',
   resolutionDetails: 'Damaged unit returned. Insurance claim filed. Replacement table delivered and inspected. Installation completed. No further delays.',
   costImpact: 0,
   scheduleImpact: 5,
   preventiveMeasures: 'Enhanced packaging requirements for SS items. Mandatory quality check on delivery before unloading. Photo documentation of all deliveries.',
   attachments: 8,
   relatedIssues: [],
  },
 ];

 const stats = {
  totalIssues: mockIssues.length,
  open: mockIssues.filter(i => i.status === 'Open').length,
  inProgress: mockIssues.filter(i => i.status === 'In Progress').length,
  resolved: mockIssues.filter(i => i.status === 'Resolved').length,
  closed: mockIssues.filter(i => i.status === 'Closed').length,
  critical: mockIssues.filter(i => i.severity === 'Critical').length,
  avgResolutionTime: 2.5,
 };

 const filteredIssues = mockIssues.filter((issue) => {
  const matchesSearch =
   issue.issueNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
   issue.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
   issue.projectName.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
  const matchesSeverity = filterSeverity === 'all' || issue.severity === filterSeverity;
  const matchesType = filterType === 'all' || issue.issueType === filterType;
  return matchesSearch && matchesStatus && matchesSeverity && matchesType;
 });

 const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
 const startIndex = (currentPage - 1) * itemsPerPage;
 const paginatedIssues = filteredIssues.slice(startIndex, startIndex + itemsPerPage);

 const getStatusColor = (status: string) => {
  switch (status) {
   case 'Open':
    return 'bg-yellow-100 text-yellow-800';
   case 'In Progress':
    return 'bg-blue-100 text-blue-800';
   case 'Resolved':
    return 'bg-green-100 text-green-800';
   case 'Closed':
    return 'bg-gray-100 text-gray-800';
   case 'Reopened':
    return 'bg-red-100 text-red-800';
   default:
    return 'bg-gray-100 text-gray-800';
  }
 };

 const getSeverityColor = (severity: string) => {
  switch (severity) {
   case 'Critical':
    return 'bg-red-100 text-red-800';
   case 'High':
    return 'bg-orange-100 text-orange-800';
   case 'Medium':
    return 'bg-yellow-100 text-yellow-800';
   case 'Low':
    return 'bg-green-100 text-green-800';
   default:
    return 'bg-gray-100 text-gray-800';
  }
 };

 const getStatusIcon = (status: string) => {
  switch (status) {
   case 'Closed':
   case 'Resolved':
    return <CheckCircle className="h-5 w-5 text-green-600" />;
   case 'In Progress':
    return <Clock className="h-5 w-5 text-blue-600" />;
   case 'Open':
   case 'Reopened':
    return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
   default:
    return null;
  }
 };

 // Handler functions
 const handleReportIssue = (data: any) => {
  console.log('Report Issue:', data);
  setShowReportModal(false);
 };

 const handleEditIssue = (data: any) => {
  console.log('Edit Issue:', data);
  setShowEditModal(false);
  setSelectedIssue(null);
 };

 const handleAssignIssue = (data: any) => {
  console.log('Assign Issue:', data);
  setShowAssignModal(false);
  setSelectedIssue(null);
 };

 const handleUpdateStatus = (data: any) => {
  console.log('Update Status:', data);
  setShowStatusModal(false);
  setSelectedIssue(null);
 };

 const handleAddRootCause = (data: any) => {
  console.log('Add Root Cause:', data);
  setShowRootCauseModal(false);
  setSelectedIssue(null);
 };

 const handleAddSolution = (data: any) => {
  console.log('Add Solution:', data);
  setShowSolutionModal(false);
  setSelectedIssue(null);
 };

 const handleAddResolution = (data: any) => {
  console.log('Add Resolution:', data);
  setShowResolutionModal(false);
  setSelectedIssue(null);
 };

 const handleAddPreventive = (data: any) => {
  console.log('Add Preventive Measures:', data);
  setShowPreventiveModal(false);
  setSelectedIssue(null);
 };

 const handleUploadAttachments = (data: any) => {
  console.log('Upload Attachments:', data);
  setShowAttachmentsModal(false);
  setSelectedIssue(null);
 };

 const handleAddComment = (data: any) => {
  console.log('Add Comment:', data);
  setShowCommentsModal(false);
  setSelectedIssue(null);
 };

 const handleGenerateReport = (data: any) => {
  console.log('Generate Report:', data);
  setShowGenerateReportModal(false);
  setSelectedIssue(null);
 };

 // Helper functions to open modals with selected issue
 const openEditModal = (issue: SiteIssue) => {
  setSelectedIssue(issue);
  setShowEditModal(true);
 };

 const openAssignModal = (issue: SiteIssue) => {
  setSelectedIssue(issue);
  setShowAssignModal(true);
 };

 const openStatusModal = (issue: SiteIssue) => {
  setSelectedIssue(issue);
  setShowStatusModal(true);
 };

 const openRootCauseModal = (issue: SiteIssue) => {
  setSelectedIssue(issue);
  setShowRootCauseModal(true);
 };

 const openSolutionModal = (issue: SiteIssue) => {
  setSelectedIssue(issue);
  setShowSolutionModal(true);
 };

 const openResolutionModal = (issue: SiteIssue) => {
  setSelectedIssue(issue);
  setShowResolutionModal(true);
 };

 const openPreventiveModal = (issue: SiteIssue) => {
  setSelectedIssue(issue);
  setShowPreventiveModal(true);
 };

 const openAttachmentsModal = (issue: SiteIssue) => {
  setSelectedIssue(issue);
  setShowAttachmentsModal(true);
 };

 const openCommentsModal = (issue: SiteIssue) => {
  setSelectedIssue(issue);
  setShowCommentsModal(true);
 };

 const openDetailsModal = (issue: SiteIssue) => {
  setSelectedIssue(issue);
  setShowDetailsModal(true);
 };

 return (
  <div className="p-6 space-y-3">
   {/* Header */}
   <div className="flex justify-between items-start">
    <div>
     <h1 className="text-3xl font-bold text-gray-900">Site Issue Tracking</h1>
     <p className="text-gray-600 mt-1">Real-time tracking and resolution of site issues</p>
    </div>
    <div className="flex items-center space-x-3">
     <button
      onClick={() => setShowGenerateReportModal(true)}
      className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
     >
      <FileText className="h-5 w-5" />
      <span>Generate Report</span>
     </button>
     <button
      onClick={() => setShowReportModal(true)}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
     >
      <Plus className="h-5 w-5" />
      <span>Report Issue</span>
     </button>
    </div>
   </div>

   {/* Statistics Cards */}
   <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
    <div className="bg-white p-3 rounded-lg border border-gray-200">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">Total Issues</p>
       <p className="text-2xl font-bold text-gray-900">{stats.totalIssues}</p>
      </div>
      <AlertTriangle className="h-8 w-8 text-blue-600" />
     </div>
    </div>
    <div className="bg-white p-3 rounded-lg border border-gray-200">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">Open</p>
       <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
      </div>
      <AlertTriangle className="h-8 w-8 text-yellow-600" />
     </div>
    </div>
    <div className="bg-white p-3 rounded-lg border border-gray-200">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">In Progress</p>
       <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
      </div>
      <Clock className="h-8 w-8 text-blue-600" />
     </div>
    </div>
    <div className="bg-white p-3 rounded-lg border border-gray-200">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">Resolved</p>
       <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
      </div>
      <CheckCircle className="h-8 w-8 text-green-600" />
     </div>
    </div>
    <div className="bg-white p-3 rounded-lg border border-gray-200">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">Closed</p>
       <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
      </div>
      <XCircle className="h-8 w-8 text-gray-600" />
     </div>
    </div>
    <div className="bg-white p-3 rounded-lg border border-gray-200">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">Critical</p>
       <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
      </div>
      <AlertTriangle className="h-8 w-8 text-red-600" />
     </div>
    </div>
    <div className="bg-white p-3 rounded-lg border border-gray-200">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">Avg Resolution</p>
       <p className="text-2xl font-bold text-purple-600">{stats.avgResolutionTime}d</p>
      </div>
      <TrendingUp className="h-8 w-8 text-purple-600" />
     </div>
    </div>
   </div>

   {/* Filters */}
   <div className="bg-white p-3 rounded-lg border border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
     <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
      <input
       type="text"
       placeholder="Search by issue number, title, project..."
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
       <option value="Open">Open</option>
       <option value="In Progress">In Progress</option>
       <option value="Resolved">Resolved</option>
       <option value="Closed">Closed</option>
       <option value="Reopened">Reopened</option>
      </select>
     </div>
     <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
      <select
       value={filterSeverity}
       onChange={(e) => setFilterSeverity(e.target.value)}
       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
       <option value="all">All Severity</option>
       <option value="Critical">Critical</option>
       <option value="High">High</option>
       <option value="Medium">Medium</option>
       <option value="Low">Low</option>
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
       <option value="Safety">Safety</option>
       <option value="Quality">Quality</option>
       <option value="Technical">Technical</option>
       <option value="Material">Material</option>
       <option value="Resource">Resource</option>
       <option value="Schedule">Schedule</option>
       <option value="Client">Client</option>
       <option value="Other">Other</option>
      </select>
     </div>
    </div>
   </div>

   {/* Issues Table */}
   <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
     <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
       <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
         Issue Details
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
         Project / Location
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
         Type / Severity
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
         Reported By
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
         Impact
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
       {paginatedIssues.map((issue) => (
        <tr key={issue.id} className="hover:bg-gray-50">
         <td className="px-4 py-4">
          <div>
           <div className="text-sm font-medium text-gray-900">{issue.issueNumber}</div>
           <div className="text-sm text-gray-600">{issue.issueTitle}</div>
           <div className="text-xs text-gray-500">{issue.reportedDate}</div>
          </div>
         </td>
         <td className="px-4 py-4">
          <div className="text-sm text-gray-900">{issue.projectId}</div>
          <div className="text-xs text-gray-600">{issue.projectName}</div>
          <div className="text-xs text-gray-500">{issue.location}</div>
         </td>
         <td className="px-4 py-4">
          <div className="space-y-1">
           <div className="text-sm text-gray-900">{issue.issueType}</div>
           <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
            {issue.severity}
           </span>
          </div>
         </td>
         <td className="px-4 py-4">
          <div className="text-sm text-gray-900">{issue.reportedBy}</div>
          <div className="text-xs text-gray-500">{issue.reportedByRole}</div>
         </td>
         <td className="px-4 py-4">
          <div className="text-xs">
           {issue.costImpact > 0 && (
            <div className="text-red-600">Cost: ₹{(issue.costImpact / 1000).toFixed(1)}K</div>
           )}
           {issue.scheduleImpact > 0 && (
            <div className="text-orange-600">Schedule: +{issue.scheduleImpact}d</div>
           )}
           {issue.costImpact === 0 && issue.scheduleImpact === 0 && (
            <div className="text-green-600">No impact</div>
           )}
          </div>
         </td>
         <td className="px-4 py-4">
          <div className="flex items-center space-x-2">
           {getStatusIcon(issue.status)}
           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
            {issue.status}
           </span>
          </div>
         </td>
         <td className="px-4 py-4">
          <div className="flex flex-wrap gap-1">
           <button
            onClick={() => openDetailsModal(issue)}
            className="p-1.5 bg-slate-50 text-slate-700 rounded hover:bg-slate-100"
            title="View Details"
           >
            <Eye className="h-4 w-4" />
           </button>
           <button
            onClick={() => openEditModal(issue)}
            className="p-1.5 bg-green-50 text-green-700 rounded hover:bg-green-100"
            title="Edit"
           >
            <Edit className="h-4 w-4" />
           </button>
           <button
            onClick={() => openAssignModal(issue)}
            className="p-1.5 bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
            title="Assign"
           >
            <Users className="h-4 w-4" />
           </button>
           <button
            onClick={() => openStatusModal(issue)}
            className="p-1.5 bg-orange-50 text-orange-700 rounded hover:bg-orange-100"
            title="Update Status"
           >
            <TrendingUp className="h-4 w-4" />
           </button>
           <button
            onClick={() => openRootCauseModal(issue)}
            className="p-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100"
            title="Root Cause"
           >
            <AlertTriangle className="h-4 w-4" />
           </button>
           <button
            onClick={() => openSolutionModal(issue)}
            className="p-1.5 bg-teal-50 text-teal-700 rounded hover:bg-teal-100"
            title="Add Solution"
           >
            <CheckCircle className="h-4 w-4" />
           </button>
           <button
            onClick={() => openResolutionModal(issue)}
            className="p-1.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
            title="Add Resolution"
           >
            <CheckCircle className="h-4 w-4" />
           </button>
           <button
            onClick={() => openPreventiveModal(issue)}
            className="p-1.5 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100"
            title="Preventive Measures"
           >
            <Shield className="h-4 w-4" />
           </button>
           <button
            onClick={() => openAttachmentsModal(issue)}
            className="p-1.5 bg-amber-50 text-amber-700 rounded hover:bg-amber-100"
            title="Upload Files"
           >
            <Upload className="h-4 w-4" />
           </button>
           <button
            onClick={() => openCommentsModal(issue)}
            className="p-1.5 bg-cyan-50 text-cyan-700 rounded hover:bg-cyan-100"
            title="Add Comment"
           >
            <MessageSquare className="h-4 w-4" />
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
       <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredIssues.length)}</span> of{' '}
       <span className="font-medium">{filteredIssues.length}</span> issues
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

   {/* All Modals */}
   <ReportIssueModal
    isOpen={showReportModal}
    onClose={() => setShowReportModal(false)}
    onReport={handleReportIssue}
   />

   <EditIssueModal
    isOpen={showEditModal}
    onClose={() => {
     setShowEditModal(false);
     setSelectedIssue(null);
    }}
    onEdit={handleEditIssue}
    issue={selectedIssue}
   />

   <AssignIssueModal
    isOpen={showAssignModal}
    onClose={() => {
     setShowAssignModal(false);
     setSelectedIssue(null);
    }}
    onAssign={handleAssignIssue}
    issue={selectedIssue}
   />

   <UpdateStatusModal
    isOpen={showStatusModal}
    onClose={() => {
     setShowStatusModal(false);
     setSelectedIssue(null);
    }}
    onUpdate={handleUpdateStatus}
    issue={selectedIssue}
   />

   <AddRootCauseModal
    isOpen={showRootCauseModal}
    onClose={() => {
     setShowRootCauseModal(false);
     setSelectedIssue(null);
    }}
    onAdd={handleAddRootCause}
    issue={selectedIssue}
   />

   <AddSolutionModal
    isOpen={showSolutionModal}
    onClose={() => {
     setShowSolutionModal(false);
     setSelectedIssue(null);
    }}
    onAdd={handleAddSolution}
    issue={selectedIssue}
   />

   <AddResolutionModal
    isOpen={showResolutionModal}
    onClose={() => {
     setShowResolutionModal(false);
     setSelectedIssue(null);
    }}
    onAdd={handleAddResolution}
    issue={selectedIssue}
   />

   <AddPreventiveMeasuresModal
    isOpen={showPreventiveModal}
    onClose={() => {
     setShowPreventiveModal(false);
     setSelectedIssue(null);
    }}
    onAdd={handleAddPreventive}
    issue={selectedIssue}
   />

   <UploadAttachmentsModal
    isOpen={showAttachmentsModal}
    onClose={() => {
     setShowAttachmentsModal(false);
     setSelectedIssue(null);
    }}
    onUpload={handleUploadAttachments}
    issue={selectedIssue}
   />

   <AddCommentsModal
    isOpen={showCommentsModal}
    onClose={() => {
     setShowCommentsModal(false);
     setSelectedIssue(null);
    }}
    onAdd={handleAddComment}
    issue={selectedIssue}
   />

   <GenerateReportModal
    isOpen={showGenerateReportModal}
    onClose={() => {
     setShowGenerateReportModal(false);
     setSelectedIssue(null);
    }}
    onGenerate={handleGenerateReport}
    issue={selectedIssue}
   />

   <ViewFullDetailsModal
    isOpen={showDetailsModal}
    onClose={() => {
     setShowDetailsModal(false);
     setSelectedIssue(null);
    }}
    issue={selectedIssue}
   />
  </div>
 );
}
