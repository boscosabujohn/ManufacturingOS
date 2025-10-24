'use client';

import React from 'react';
import { GitBranch, Package, MapPin, Clock } from 'lucide-react';

export interface TraceabilityRecord {
  serialNumber: string;
  productName: string;
  batchNumber: string;
  workOrder: string;
  genealogy: { step: string; workCenter: string; operator: string; timestamp: string; materials: string[] }[];
  qualityChecks: { checkpoint: string; result: 'pass' | 'fail'; inspector: string; timestamp: string }[];
  currentLocation: string;
  status: 'in-production' | 'completed' | 'shipped';
}

const Traceability: React.FC = () => {
  const records: TraceabilityRecord[] = [
    {
      serialNumber: 'SN-2025-10001',
      productName: 'Precision Gear Assembly',
      batchNumber: 'BATCH-2025-045',
      workOrder: 'WO-2025-1234',
      status: 'completed',
      currentLocation: 'Finished Goods - Rack A12',
      genealogy: [
        { step: 'Raw Material Cutting', workCenter: 'SAW-01', operator: 'John Doe', timestamp: '2025-10-23 08:00', materials: ['Steel Rod 50mm - LOT-2025-0891'] },
        { step: 'CNC Machining', workCenter: 'CNC-01', operator: 'Mike Chen', timestamp: '2025-10-23 10:30', materials: [] },
        { step: 'Heat Treatment', workCenter: 'FURNACE-01', operator: 'Sarah Lee', timestamp: '2025-10-23 14:00', materials: ['Quenching Oil - LOT-2025-0234'] },
        { step: 'Final Assembly', workCenter: 'ASM-01', operator: 'Tom Wilson', timestamp: '2025-10-24 09:00', materials: ['Bearing - LOT-2025-0456', 'Seal Kit - LOT-2025-0567'] },
      ],
      qualityChecks: [
        { checkpoint: 'First Piece Inspection', result: 'pass', inspector: 'QC-John', timestamp: '2025-10-23 11:00' },
        { checkpoint: 'Dimensional Check', result: 'pass', inspector: 'QC-Sarah', timestamp: '2025-10-23 16:00' },
        { checkpoint: 'Final Inspection', result: 'pass', inspector: 'QC-Mike', timestamp: '2025-10-24 10:30' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <GitBranch className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Traceability & Genealogy</h2>
            <p className="text-indigo-100">Complete product tracking from raw material to finished goods</p>
          </div>
        </div>
      </div>

      {records.map((record) => (
        <div key={record.serialNumber} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{record.serialNumber}</h3>
                <p className="text-sm text-indigo-100">{record.productName}</p>
              </div>
              <div className="text-right">
                <div className="text-sm">Work Order: {record.workOrder}</div>
                <div className="text-sm">Batch: {record.batchNumber}</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="font-semibold text-gray-900 capitalize">{record.status.replace('-', ' ')}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded">
                <MapPin className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-sm text-gray-600">Current Location</div>
                  <div className="font-semibold text-gray-900">{record.currentLocation}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Manufacturing Genealogy</h4>
              <div className="space-y-4">
                {record.genealogy.map((step, idx) => (
                  <div key={idx} className="relative pl-8 pb-4 border-l-2 border-indigo-300 last:border-l-0 last:pb-0">
                    <div className="absolute left-0 top-0 -ml-2 w-4 h-4 rounded-full bg-indigo-600"></div>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">{step.step}</h5>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {step.timestamp}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Work Center: <span className="font-medium">{step.workCenter}</span></div>
                        <div>Operator: <span className="font-medium">{step.operator}</span></div>
                        {step.materials.length > 0 && (
                          <div>
                            Materials Used:
                            <ul className="list-disc list-inside ml-2 mt-1">
                              {step.materials.map((mat, midx) => (
                                <li key={midx} className="text-xs">{mat}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quality Checkpoints</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {record.qualityChecks.map((check, idx) => (
                  <div key={idx} className={`p-4 rounded border-l-4 ${check.result === 'pass' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{check.checkpoint}</h5>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${check.result === 'pass' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {check.result}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Inspector: {check.inspector}</div>
                      <div className="text-xs">{check.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Traceability;
