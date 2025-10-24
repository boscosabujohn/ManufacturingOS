'use client';

import React, { useState } from 'react';
import { Barcode, CheckCircle, Package, MapPin, Scan } from 'lucide-react';

export default function BarcodeScanningWorkflows() {
  const [scanMode, setScanMode] = useState<'receiving' | 'picking' | 'transfer' | 'count'>('receiving');
  const [scannedItems, setScannedItems] = useState<string[]>([]);

  const workflows = {
    receiving: { icon: Package, label: 'Goods Receipt', color: 'blue' },
    picking: { icon: Scan, label: 'Order Picking', color: 'green' },
    transfer: { icon: MapPin, label: 'Stock Transfer', color: 'purple' },
    count: { icon: Barcode, label: 'Inventory Count', color: 'orange' },
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Barcode Scanning Workflows</h1>
          <p className="text-gray-600">Mobile-optimized scanning for warehouse operations</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries(workflows).map(([key, workflow]) => {
            const Icon = workflow.icon;
            return (
              <button
                key={key}
                onClick={() => setScanMode(key as any)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  scanMode === key
                    ? `border-${workflow.color}-600 bg-${workflow.color}-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${scanMode === key ? `text-${workflow.color}-600` : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${scanMode === key ? `text-${workflow.color}-900` : 'text-gray-600'}`}>
                  {workflow.label}
                </p>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Barcode className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan Barcode/QR Code</h2>
            <p className="text-gray-600">Point camera at barcode or enter manually</p>
          </div>

          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Scan or enter barcode..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg mb-4 focus:border-blue-500 focus:outline-none"
            />

            <div className="space-y-2">
              {scannedItems.length > 0 ? (
                scannedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-mono text-gray-900">{item}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Scan className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No items scanned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
