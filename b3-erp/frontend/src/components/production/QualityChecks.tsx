'use client';

import React, { useState } from 'react';
import { ClipboardCheck, CheckCircle, XCircle, AlertTriangle, TrendingUp, Download, RefreshCw, Settings, Eye, FileText, Plus, Edit } from 'lucide-react';

export type InspectionStatus = 'passed' | 'failed' | 'pending' | 'conditional';
export type InspectionType = 'first-piece' | 'in-process' | 'final' | 'dimensional' | 'visual';

export interface QualityInspection {
  id: string;
  inspectionNumber: string;
  productName: string;
  type: InspectionType;
  status: InspectionStatus;
  inspector: string;
  timestamp: string;
  samplesChecked: number;
  defectsFound: number;
  specifications: { parameter: string; target: number; actual: number; tolerance: number; status: 'pass' | 'fail' }[];
}

const QualityChecks: React.FC = () => {
  const inspections: QualityInspection[] = [
    {
      id: 'QC001',
      inspectionNumber: 'INS-2025-1001',
      productName: 'Precision Gear',
      type: 'dimensional',
      status: 'passed',
      inspector: 'John Smith',
      timestamp: '2025-10-24 10:30',
      samplesChecked: 5,
      defectsFound: 0,
      specifications: [
        { parameter: 'Outer Diameter', target: 50.0, actual: 50.02, tolerance: 0.05, status: 'pass' },
        { parameter: 'Inner Diameter', target: 30.0, actual: 29.98, tolerance: 0.05, status: 'pass' },
        { parameter: 'Thickness', target: 10.0, actual: 10.01, tolerance: 0.03, status: 'pass' },
      ],
    },
    {
      id: 'QC002',
      inspectionNumber: 'INS-2025-1002',
      productName: 'Motor Housing',
      type: 'visual',
      status: 'failed',
      inspector: 'Sarah Johnson',
      timestamp: '2025-10-24 11:15',
      samplesChecked: 3,
      defectsFound: 2,
      specifications: [
        { parameter: 'Surface Finish', target: 100, actual: 85, tolerance: 10, status: 'fail' },
        { parameter: 'Coating Thickness', target: 50, actual: 42, tolerance: 5, status: 'fail' },
      ],
    },
    {
      id: 'QC003',
      inspectionNumber: 'INS-2025-1003',
      productName: 'Valve Body',
      type: 'first-piece',
      status: 'pending',
      inspector: 'Mike Chen',
      timestamp: '2025-10-24 12:00',
      samplesChecked: 1,
      defectsFound: 0,
      specifications: [],
    },
  ];

  const getStatusColor = (status: InspectionStatus): string => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'conditional': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler functions
  const handleRefreshInspections = () => {
    console.log('Refreshing quality inspections...');
    alert('Refreshing quality inspection data...\n\nAll pending and recent inspections will be updated.');
  };

  const handleExportQualityReport = () => {
    console.log('Exporting quality report...');
    alert('Exporting Quality Inspection Report to Excel...\n\nIncludes:\n- All inspection records\n- Pass/Fail statistics\n- Specification measurements\n- Inspector details\n- Defect analysis');
  };

  const handleQualitySettings = () => {
    console.log('Opening quality settings...');
    alert('Quality Control Settings\n\nConfigure:\n- Inspection types and workflows\n- Acceptance criteria and tolerances\n- Inspector assignments\n- Alert thresholds\n- Documentation requirements');
  };

  const handleNewInspection = () => {
    alert('Create New Inspection\n\nSelect inspection type:\n- First Piece Inspection\n- In-Process Inspection\n- Final Inspection\n- Dimensional Inspection\n- Visual Inspection\n\nChoose product and work order to begin.');
  };

  const handleViewInspection = (inspection: QualityInspection) => {
    const specDetails = inspection.specifications.map(spec =>
      `${spec.parameter}: ${spec.actual} (Target: ${spec.target} ± ${spec.tolerance}) - ${spec.status.toUpperCase()}`
    ).join('\n');

    alert(`Inspection Details: ${inspection.inspectionNumber}\n\nProduct: ${inspection.productName}\nType: ${inspection.type}\nStatus: ${inspection.status}\n\nInspector: ${inspection.inspector}\nTimestamp: ${inspection.timestamp}\n\nSamples Checked: ${inspection.samplesChecked}\nDefects Found: ${inspection.defectsFound}\n\nSpecifications:\n${specDetails || 'No specifications recorded yet'}`);
  };

  const handleEditInspection = (inspection: QualityInspection) => {
    if (inspection.status !== 'pending') {
      alert(`Inspection ${inspection.inspectionNumber} is ${inspection.status}.\n\nOnly pending inspections can be edited.`);
      return;
    }
    alert(`Edit Inspection: ${inspection.inspectionNumber}\n\nProduct: ${inspection.productName}\nType: ${inspection.type}\n\nUpdate inspection details, measurements, and status.`);
  };

  const handleApproveInspection = (inspection: QualityInspection) => {
    if (inspection.status !== 'pending') {
      alert(`Inspection ${inspection.inspectionNumber} is already ${inspection.status}.`);
      return;
    }

    if (inspection.specifications.length === 0) {
      alert(`Cannot approve inspection ${inspection.inspectionNumber}.\n\nPlease complete all specification measurements first.`);
      return;
    }

    const failedSpecs = inspection.specifications.filter(s => s.status === 'fail');
    if (failedSpecs.length > 0) {
      if (confirm(`Warning: ${failedSpecs.length} specification(s) failed:\n${failedSpecs.map(s => s.parameter).join(', ')}\n\nMark as FAILED?`)) {
        console.log('Marking inspection as failed:', inspection);
        alert(`Inspection ${inspection.inspectionNumber} marked as FAILED.\n\nNon-conformance report will be generated.\nProduction team notified.`);
      }
    } else {
      if (confirm(`Approve inspection ${inspection.inspectionNumber}?\n\nAll specifications passed.\n\nThis will mark the inspection as PASSED.`)) {
        console.log('Approving inspection:', inspection);
        alert(`Inspection ${inspection.inspectionNumber} APPROVED!\n\nAll quality checks passed.\nProduct cleared for next stage.`);
      }
    }
  };

  const handleGenerateNCR = (inspection: QualityInspection) => {
    if (inspection.status !== 'failed') {
      alert(`Inspection ${inspection.inspectionNumber} has not failed.\n\nNon-conformance reports are only generated for failed inspections.`);
      return;
    }
    alert(`Generate Non-Conformance Report (NCR)\n\nInspection: ${inspection.inspectionNumber}\nProduct: ${inspection.productName}\nDefects: ${inspection.defectsFound}\n\nNCR will be created and routed for corrective action.\n\nRoot cause analysis required.`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClipboardCheck className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Quality Checks & Inspections</h2>
              <p className="text-purple-100">In-process and final quality control workflows</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleNewInspection}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Inspection</span>
            </button>
            <button
              onClick={handleRefreshInspections}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleQualitySettings}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleExportQualityReport}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Passed</p>
              <p className="text-2xl font-bold text-green-600">{inspections.filter(i => i.status === 'passed').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{inspections.filter(i => i.status === 'failed').length}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{inspections.filter(i => i.status === 'pending').length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pass Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {((inspections.filter(i => i.status === 'passed').length / inspections.filter(i => i.status !== 'pending').length) * 100).toFixed(0)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quality Inspections</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {inspections.map((inspection) => (
            <div key={inspection.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{inspection.inspectionNumber}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inspection.status)}`}>
                      {inspection.status}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {inspection.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Product: <strong>{inspection.productName}</strong> | Inspector: {inspection.inspector} | {inspection.timestamp}
                  </p>
                  <p className="text-sm text-gray-600">
                    Samples: {inspection.samplesChecked} | Defects: <span className={inspection.defectsFound > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>{inspection.defectsFound}</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewInspection(inspection)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {inspection.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleEditInspection(inspection)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        title="Edit Inspection"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleApproveInspection(inspection)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        title="Approve Inspection"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                    </>
                  )}
                  {inspection.status === 'failed' && (
                    <button
                      onClick={() => handleGenerateNCR(inspection)}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      title="Generate Non-Conformance Report"
                    >
                      <FileText className="h-4 w-4" />
                      <span>NCR</span>
                    </button>
                  )}
                </div>
              </div>

              {inspection.specifications.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Specifications:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {inspection.specifications.map((spec, idx) => (
                      <div key={idx} className={`p-3 rounded border-l-4 ${spec.status === 'pass' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{spec.parameter}</span>
                          {spec.status === 'pass' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                        </div>
                        <div className="text-xs text-gray-600">
                          Target: {spec.target} ± {spec.tolerance}
                        </div>
                        <div className={`text-sm font-bold ${spec.status === 'pass' ? 'text-green-700' : 'text-red-700'}`}>
                          Actual: {spec.actual}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QualityChecks;
