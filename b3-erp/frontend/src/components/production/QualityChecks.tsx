'use client';

import React from 'react';
import { ClipboardCheck, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <ClipboardCheck className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Quality Checks & Inspections</h2>
            <p className="text-purple-100">In-process and final quality control workflows</p>
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
