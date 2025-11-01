'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Plus, Filter, AlertTriangle, CheckCircle, Clock, XCircle, FileText, User, Eye, Edit } from 'lucide-react';
import { RaiseNCRModal, ViewNCRDetailsModal, EditNCRModal } from '@/components/quality/NCRModals';
import { ExportNCRModal } from '@/components/quality/QualityExportModals';

interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  productCode: string;
  productName: string;
  workOrder: string;
  lotNumber: string;
  quantityAffected: number;
  detectedBy: string;
  detectedDate: string;
  detectedStage: string;
  severity: 'critical' | 'major' | 'minor';
  status: 'open' | 'under-investigation' | 'corrective-action' | 'closed' | 'rejected';
  nonconformanceType: 'dimensional' | 'material' | 'visual' | 'functional' | 'safety' | 'packaging';
  description: string;
  rootCause: string | null;
  correctiveAction: string | null;
  preventiveAction: string | null;
  assignedTo: string;
  targetCloseDate: string;
  actualCloseDate: string | null;
  costImpact: number;
  customerImpact: boolean;
  attachments: string[];
  approvedBy: string | null;
  verifiedBy: string | null;
}

export default function NCRPage() {
  const router = useRouter();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal state hooks
  const [isRaiseOpen, setIsRaiseOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedNCR, setSelectedNCR] = useState<NCR | null>(null);

  // Mock data for NCRs
  const ncrs: NCR[] = [
    {
      id: '1',
      ncrNumber: 'NCR-2025-0042',
      title: 'Surface Finish Defect - Kitchen Sink',
      productCode: 'KIT-SINK-001',
      productName: 'Premium Stainless Steel Kitchen Sink - Double Bowl',
      workOrder: 'WO-2025-1135',
      lotNumber: 'LOT-2025-1015',
      quantityAffected: 15,
      detectedBy: 'Kavita Desai',
      detectedDate: '2025-10-18',
      detectedStage: 'Final Inspection',
      severity: 'major',
      status: 'corrective-action',
      nonconformanceType: 'visual',
      description: 'Multiple units showing uneven polishing with visible scratch marks on the bowl surface. Does not meet mirror finish specification (Ra < 0.8)',
      rootCause: 'Polishing wheel worn beyond replacement threshold. Operator failed to identify degraded wheel condition during daily inspection.',
      correctiveAction: 'Replaced polishing wheel. Re-polished affected units. Implemented hourly wheel condition checks.',
      preventiveAction: 'Introduced wheel lifetime counter and automatic replacement alerts. Enhanced operator training on wheel inspection.',
      assignedTo: 'Production Supervisor',
      targetCloseDate: '2025-10-25',
      actualCloseDate: null,
      costImpact: 45000,
      customerImpact: false,
      attachments: ['photo_1.jpg', 'inspection_report.pdf'],
      approvedBy: null,
      verifiedBy: null
    },
    {
      id: '2',
      ncrNumber: 'NCR-2025-0043',
      title: 'Pressure Test Failure - Kitchen Faucet',
      productCode: 'KIT-FAUCET-002',
      productName: 'Chrome Kitchen Faucet with Pull-Down Sprayer',
      workOrder: 'WO-2025-1138',
      lotNumber: 'LOT-2025-1018',
      quantityAffected: 8,
      detectedBy: 'Quality Control Team',
      detectedDate: '2025-10-19',
      detectedStage: 'Pressure Testing',
      severity: 'critical',
      status: 'under-investigation',
      nonconformanceType: 'functional',
      description: '8 units failed pressure test at 120 PSI. Observed water leakage from hose connection point after 45 seconds.',
      rootCause: 'Under investigation - suspected batch issue with O-ring supplier. Material hardness testing in progress.',
      correctiveAction: 'Quarantined entire lot. Initiated supplier audit. Testing O-ring samples from multiple batches.',
      preventiveAction: 'To be determined after root cause analysis complete.',
      assignedTo: 'Quality Manager',
      targetCloseDate: '2025-10-26',
      actualCloseDate: null,
      costImpact: 128000,
      customerImpact: true,
      attachments: ['test_results.xlsx', 'photos_leak.zip'],
      approvedBy: null,
      verifiedBy: null
    },
    {
      id: '3',
      ncrNumber: 'NCR-2025-0041',
      title: 'Coating Adhesion Failure - Cookware',
      productCode: 'KIT-COOKWARE-003',
      productName: 'Non-Stick Cookware Set (7 Pieces)',
      workOrder: 'WO-2025-1142',
      lotNumber: 'LOT-2025-1012',
      quantityAffected: 25,
      detectedBy: 'QC Inspector',
      detectedDate: '2025-10-16',
      detectedStage: 'Coating Quality Check',
      severity: 'critical',
      status: 'closed',
      nonconformanceType: 'material',
      description: 'Coating adhesion test failed. Cross-hatch test showing 3B rating instead of required 5B minimum. Coating peeling observed.',
      rootCause: 'Surface preparation incomplete - aluminum base not properly degreased before coating application. Degreasing bath temperature was 15°C below specification.',
      correctiveAction: 'Scrapped 25 affected units. Recalibrated degreasing bath heater. Verified temperature control system. Re-coated new batch with proper surface prep.',
      preventiveAction: 'Installed digital temperature monitoring with alerts. Updated work instruction with temperature verification checkpoints. Monthly calibration of heating system.',
      assignedTo: 'Production Manager',
      targetCloseDate: '2025-10-20',
      actualCloseDate: '2025-10-20',
      costImpact: 185000,
      customerImpact: false,
      attachments: ['adhesion_test_report.pdf', 'temperature_logs.csv'],
      approvedBy: 'Quality Manager',
      verifiedBy: 'QC Lead'
    },
    {
      id: '4',
      ncrNumber: 'NCR-2025-0044',
      title: 'Dimensional Non-Conformance - Cabinet',
      productCode: 'KIT-CABINET-004',
      productName: 'Modular Kitchen Cabinet - Base Unit (36")',
      workOrder: 'WO-2025-1150',
      lotNumber: 'LOT-2025-1020',
      quantityAffected: 5,
      detectedBy: 'Assembly Team',
      detectedDate: '2025-10-20',
      detectedStage: 'Pre-Assembly Inspection',
      severity: 'minor',
      status: 'open',
      nonconformanceType: 'dimensional',
      description: '5 cabinet panels showing width dimension out of tolerance. Measured 917mm instead of specified 915mm ±2mm.',
      rootCause: null,
      correctiveAction: null,
      preventiveAction: null,
      assignedTo: 'Production Supervisor',
      targetCloseDate: '2025-10-27',
      actualCloseDate: null,
      costImpact: 15000,
      customerImpact: false,
      attachments: ['measurement_report.pdf'],
      approvedBy: null,
      verifiedBy: null
    },
    {
      id: '5',
      ncrNumber: 'NCR-2025-0040',
      title: 'Electrical Safety Issue - Chimney Motor',
      productCode: 'KIT-CHIMNEY-001',
      productName: 'Built-in Kitchen Chimney (60cm)',
      workOrder: 'WO-2025-1145',
      lotNumber: 'LOT-2025-1008',
      quantityAffected: 3,
      detectedBy: 'Electrical Testing Team',
      detectedDate: '2025-10-15',
      detectedStage: 'Electrical Safety Testing',
      severity: 'critical',
      status: 'closed',
      nonconformanceType: 'safety',
      description: 'Insulation resistance test failure. Measured 1.5 MΩ instead of required minimum 2 MΩ at 500V DC. Critical safety issue.',
      rootCause: 'Motor winding insulation degraded during high-temperature assembly process. Soldering iron temperature exceeded specification by 50°C.',
      correctiveAction: 'Scrapped 3 affected units. Replaced motors. Calibrated soldering stations. Implemented temperature monitoring during assembly.',
      preventiveAction: 'Purchased calibrated soldering stations with auto-shutoff. Added temperature verification to work instruction. Weekly calibration checks.',
      assignedTo: 'Engineering Manager',
      targetCloseDate: '2025-10-18',
      actualCloseDate: '2025-10-17',
      costImpact: 95000,
      customerImpact: false,
      attachments: ['electrical_test_report.pdf', 'motor_inspection.jpg'],
      approvedBy: 'Quality Manager',
      verifiedBy: 'Safety Officer'
    },
    {
      id: '6',
      ncrNumber: 'NCR-2025-0045',
      title: 'Packaging Damage - Mixer Grinder',
      productCode: 'KIT-MIXER-007',
      productName: 'Electric Mixer Grinder - 750W',
      workOrder: 'WO-2025-1149',
      lotNumber: 'LOT-2025-1022',
      quantityAffected: 12,
      detectedBy: 'Packaging Team',
      detectedDate: '2025-10-20',
      detectedStage: 'Packaging',
      severity: 'minor',
      status: 'corrective-action',
      nonconformanceType: 'packaging',
      description: 'Outer carton boxes showing damage/crushing on corners. Internal product unaffected but packaging not meeting cosmetic standards.',
      rootCause: 'Forklift operator stacking boxes 3 layers higher than specification. Bottom layer cartons unable to support weight.',
      correctiveAction: 'Re-packaged affected units in new cartons. Retrained forklift operators on stacking limits. Added warning labels on boxes.',
      preventiveAction: 'Updated stacking diagram in warehouse. Installed height markers on storage racks. Weekly operator refresher training.',
      assignedTo: 'Warehouse Manager',
      targetCloseDate: '2025-10-24',
      actualCloseDate: null,
      costImpact: 8000,
      customerImpact: false,
      attachments: ['carton_damage_photos.zip'],
      approvedBy: null,
      verifiedBy: null
    },
    {
      id: '7',
      ncrNumber: 'NCR-2025-0039',
      title: 'Material Grade Mismatch - Sink Raw Material',
      productCode: 'KIT-SINK-001',
      productName: 'Premium Stainless Steel Kitchen Sink - Double Bowl',
      workOrder: 'WO-2025-1135',
      lotNumber: 'LOT-2025-1005',
      quantityAffected: 0,
      detectedBy: 'Incoming Inspection',
      detectedDate: '2025-10-12',
      detectedStage: 'Incoming Material Inspection',
      severity: 'critical',
      status: 'closed',
      nonconformanceType: 'material',
      description: 'Supplier shipped SS316 grade instead of specified SS304. Detected during material certificate verification before production.',
      rootCause: 'Supplier order entry error. Purchase order correctly specified SS304 but supplier fulfilled with SS316 from wrong inventory.',
      correctiveAction: 'Rejected entire shipment. Returned to supplier. Issued supplier corrective action request. Ordered replacement material.',
      preventiveAction: 'Added barcode scanning verification at supplier dispatch. Enhanced supplier training on order verification. Monthly supplier audit.',
      assignedTo: 'Procurement Manager',
      targetCloseDate: '2025-10-15',
      actualCloseDate: '2025-10-14',
      costImpact: 225000,
      customerImpact: false,
      attachments: ['material_cert.pdf', 'supplier_response.pdf'],
      approvedBy: 'Operations Head',
      verifiedBy: 'Quality Manager'
    },
    {
      id: '8',
      ncrNumber: 'NCR-2025-0038',
      title: 'Noise Level Exceeds Specification - Chimney',
      productCode: 'KIT-CHIMNEY-001',
      productName: 'Built-in Kitchen Chimney (60cm)',
      workOrder: 'WO-2025-1145',
      lotNumber: 'LOT-2025-1002',
      quantityAffected: 18,
      detectedBy: 'Acoustic Testing',
      detectedDate: '2025-10-10',
      detectedStage: 'Performance Testing',
      severity: 'major',
      status: 'rejected',
      nonconformanceType: 'functional',
      description: 'Sound level measured at 62 dB instead of specified maximum 58 dB at highest speed. Exceeds BIS standard requirement.',
      rootCause: 'Investigation revealed vibration dampening pads missing from motor mounting. Design change not communicated to production.',
      correctiveAction: 'Proposed to retrofit dampening pads on affected units and retest.',
      preventiveAction: 'Proposal rejected - retrofit cost exceeds scrap value. Units to be scrapped. Enhanced design change communication process.',
      assignedTo: 'Production Manager',
      targetCloseDate: '2025-10-18',
      actualCloseDate: '2025-10-18',
      costImpact: 340000,
      customerImpact: false,
      attachments: ['acoustic_test_report.pdf', 'design_change_notice.pdf'],
      approvedBy: 'Quality Manager',
      verifiedBy: null
    }
  ];

  const filteredNCRs = ncrs.filter(ncr => {
    const severityMatch = filterSeverity === 'all' || ncr.severity === filterSeverity;
    const statusMatch = filterStatus === 'all' || ncr.status === filterStatus;
    const typeMatch = filterType === 'all' || ncr.nonconformanceType === filterType;
    return severityMatch && statusMatch && typeMatch;
  });

  const totalNCRs = ncrs.length;
  const openNCRs = ncrs.filter(n => n.status === 'open' || n.status === 'under-investigation' || n.status === 'corrective-action').length;
  const criticalNCRs = ncrs.filter(n => n.severity === 'critical').length;
  const closedNCRs = ncrs.filter(n => n.status === 'closed').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'major': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'minor': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-700 bg-red-100';
      case 'under-investigation': return 'text-blue-700 bg-blue-100';
      case 'corrective-action': return 'text-yellow-700 bg-yellow-100';
      case 'closed': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dimensional': return 'text-blue-700 bg-blue-50';
      case 'material': return 'text-purple-700 bg-purple-50';
      case 'visual': return 'text-green-700 bg-green-50';
      case 'functional': return 'text-orange-700 bg-orange-50';
      case 'safety': return 'text-red-700 bg-red-50';
      case 'packaging': return 'text-yellow-700 bg-yellow-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-5 h-5" />;
      case 'under-investigation': return <Clock className="w-5 h-5" />;
      case 'corrective-action': return <FileText className="w-5 h-5" />;
      case 'closed': return <CheckCircle className="w-5 h-5" />;
      case 'rejected': return <XCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  // Handler functions
  const handleRaise = () => {
    setIsRaiseOpen(true);
  };

  const handleView = (ncr: NCR) => {
    // Convert NCR format for modal compatibility
    const modalNCR = convertNCRForModal(ncr);
    setSelectedNCR(modalNCR as any);
    setIsViewOpen(true);
  };

  const handleEdit = (ncr: NCR) => {
    // Convert NCR format for modal compatibility
    const modalNCR = convertNCRForModal(ncr);
    setSelectedNCR(modalNCR as any);
    setIsEditOpen(true);
  };

  // Helper function to convert NCR format for modal compatibility
  const convertNCRForModal = (ncr: NCR): any => {
    return {
      ...ncr,
      severity: ncr.severity.charAt(0).toUpperCase() + ncr.severity.slice(1),
      status: ncr.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      detectionDate: ncr.detectedDate,
      detectionStage: ncr.detectedStage,
      createdDate: ncr.detectedDate,
      lastModified: ncr.detectedDate,
    };
  };

  const handleExport = () => {
    setIsExportOpen(true);
  };

  const handleRaiseSubmit = (data: any) => {
    // TODO: Implement API call to create new NCR
    console.log('Raise NCR submitted:', data);
    setIsRaiseOpen(false);
  };

  const handleViewClose = () => {
    setIsViewOpen(false);
    setSelectedNCR(null);
  };

  const handleEditSubmit = (data: any) => {
    // TODO: Implement API call to update NCR
    console.log('Edit NCR submitted:', data);
    setIsEditOpen(false);
    setSelectedNCR(null);
  };

  const handleExportSubmit = (data: any) => {
    // TODO: Implement API call to export NCR data
    console.log('Export NCR submitted:', data);
    setIsExportOpen(false);
  };

  const handleCloseNCR = (ncrId: string) => {
    // TODO: Implement API call to close NCR
    console.log('Close NCR:', ncrId);
    setIsViewOpen(false);
    setSelectedNCR(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Non-Conformance Reports (NCR)</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage quality non-conformances</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRaise}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Raise NCR</span>
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total NCRs</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalNCRs}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <FileText className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Open NCRs</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{openNCRs}</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critical NCRs</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{criticalNCRs}</p>
            </div>
            <div className="p-3 bg-red-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Closed NCRs</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{closedNCRs}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="under-investigation">Under Investigation</option>
            <option value="corrective-action">Corrective Action</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="dimensional">Dimensional</option>
            <option value="material">Material</option>
            <option value="visual">Visual</option>
            <option value="functional">Functional</option>
            <option value="safety">Safety</option>
            <option value="packaging">Packaging</option>
          </select>
        </div>
      </div>

      {/* NCR List */}
      <div className="space-y-4">
        {filteredNCRs.map((ncr) => (
          <div key={ncr.id} className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-shadow ${getSeverityColor(ncr.severity)}`}>
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`p-3 rounded-lg ${getStatusColor(ncr.status)}`}>
                {getStatusIcon(ncr.status)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{ncr.ncrNumber}</h3>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(ncr.severity)}`}>
                        {ncr.severity}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ncr.status)}`}>
                        {ncr.status}
                      </span>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(ncr.nonconformanceType)}`}>
                        {ncr.nonconformanceType}
                      </span>
                      {ncr.customerImpact && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <AlertTriangle className="w-3 h-3" />
                          Customer Impact
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">{ncr.title}</p>
                    <p className="text-gray-700 mb-3">{ncr.description}</p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Product</p>
                        <p className="font-semibold text-gray-900">{ncr.productCode}</p>
                        <p className="text-xs text-gray-600">{ncr.productName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Work Order / Lot</p>
                        <p className="font-semibold text-blue-600">{ncr.workOrder}</p>
                        <p className="text-xs text-gray-600">{ncr.lotNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Quantity Affected</p>
                        <p className="font-semibold text-red-600">{ncr.quantityAffected} units</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cost Impact</p>
                        <p className="font-semibold text-orange-600">₹{ncr.costImpact.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Detected By
                        </p>
                        <p className="font-semibold text-gray-900">{ncr.detectedBy}</p>
                        <p className="text-xs text-gray-600">{ncr.detectedDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Detection Stage</p>
                        <p className="font-semibold text-gray-900">{ncr.detectedStage}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Assigned To</p>
                        <p className="font-semibold text-gray-900">{ncr.assignedTo}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Target Close Date</p>
                        <p className="font-semibold text-gray-900">{ncr.targetCloseDate}</p>
                        {ncr.actualCloseDate && (
                          <p className="text-xs text-green-600">Closed: {ncr.actualCloseDate}</p>
                        )}
                      </div>
                    </div>

                    {/* Root Cause & Actions */}
                    {(ncr.rootCause || ncr.correctiveAction || ncr.preventiveAction) && (
                      <div className="space-y-2">
                        {ncr.rootCause && (
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm font-semibold text-yellow-800 mb-1">Root Cause</p>
                            <p className="text-sm text-gray-700">{ncr.rootCause}</p>
                          </div>
                        )}
                        {ncr.correctiveAction && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-semibold text-blue-800 mb-1">Corrective Action</p>
                            <p className="text-sm text-gray-700">{ncr.correctiveAction}</p>
                          </div>
                        )}
                        {ncr.preventiveAction && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm font-semibold text-green-800 mb-1">Preventive Action</p>
                            <p className="text-sm text-gray-700">{ncr.preventiveAction}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Approval/Verification */}
                    {(ncr.approvedBy || ncr.verifiedBy) && (
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        {ncr.approvedBy && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Approved by {ncr.approvedBy}</span>
                          </div>
                        )}
                        {ncr.verifiedBy && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Verified by {ncr.verifiedBy}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleView(ncr)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                {ncr.status !== 'closed' && ncr.status !== 'rejected' && (
                  <button
                    onClick={() => handleEdit(ncr)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Components */}
      <RaiseNCRModal
        isOpen={isRaiseOpen}
        onClose={() => setIsRaiseOpen(false)}
        onSave={handleRaiseSubmit}
      />

      <ViewNCRDetailsModal
        isOpen={isViewOpen}
        onClose={handleViewClose}
        ncr={selectedNCR}
        onEdit={(ncr) => handleEdit(ncr as any)}
        onCloseNCR={handleCloseNCR}
      />

      <EditNCRModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditSubmit}
        ncr={selectedNCR}
      />

      <ExportNCRModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExportSubmit}
      />
    </div>
  );
}
