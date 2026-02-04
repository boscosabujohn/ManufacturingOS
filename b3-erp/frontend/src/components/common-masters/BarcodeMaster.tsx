'use client';

import React, { useState } from 'react';
import { Barcode, Plus, Search, Eye, Edit3, Download, Upload, CheckCircle, XCircle, Camera, Scan } from 'lucide-react';

interface BarcodeEntry {
  id: string;
  barcodeNumber: string;
  barcodeType: 'EAN13' | 'UPC' | 'CODE128' | 'CODE39' | 'QR' | 'DATAMATRIX';
  itemCode: string;
  itemName: string;
  uom?: string;
  variant?: string;
  status: 'active' | 'inactive' | 'retired';
  isPrimary: boolean;
  generatedDate: string;
  lastScanned?: string;
  scanCount: number;
  printCount: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

const BarcodeMaster: React.FC = () => {
  const [barcodes, setBarcodes] = useState<BarcodeEntry[]>([
    {
      id: '1',
      barcodeNumber: '8901234567890',
      barcodeType: 'EAN13',
      itemCode: 'WOOD-OAK-001',
      itemName: 'Premium Oak Wood - 1 inch',
      uom: 'SQFT',
      status: 'active',
      isPrimary: true,
      generatedDate: '2024-01-15',
      scanCount: 1250,
      printCount: 50,
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      barcodeNumber: '1234567890128',
      barcodeType: 'CODE128',
      itemCode: 'KIT-PREM-001',
      itemName: 'Premium Kitchen Cabinet Set',
      uom: 'SET',
      status: 'active',
      isPrimary: true,
      generatedDate: '2024-01-20',
      lastScanned: '2024-02-10',
      scanCount: 450,
      printCount: 25,
      createdBy: 'admin',
      createdAt: '2024-01-20T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredBarcodes = barcodes.filter(b =>
    b.barcodeNumber.includes(searchTerm) ||
    b.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      EAN13: 'bg-blue-100 text-blue-800',
      UPC: 'bg-green-100 text-green-800',
      CODE128: 'bg-purple-100 text-purple-800',
      CODE39: 'bg-yellow-100 text-yellow-800',
      QR: 'bg-pink-100 text-pink-800',
      DATAMATRIX: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Barcode className="w-8 h-8 text-blue-600" />
                Barcode Master
              </h1>
              <p className="text-gray-600 mt-2">Manage product barcodes and QR codes</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Scan className="w-4 h-4" />
                Scan
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Print Labels
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Generate Barcode
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by barcode, item code, or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Barcodes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{barcodes.length}</p>
              </div>
              <Barcode className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Barcodes</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {barcodes.filter(b => b.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {barcodes.reduce((sum, b) => sum + b.scanCount, 0).toLocaleString()}
                </p>
              </div>
              <Scan className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Labels Printed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {barcodes.reduce((sum, b) => sum + b.printCount, 0)}
                </p>
              </div>
              <Download className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Barcodes List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Barcode</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">UOM</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Scans</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBarcodes.map(barcode => (
                <tr key={barcode.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Barcode className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="font-mono font-medium text-gray-900">{barcode.barcodeNumber}</div>
                        {barcode.isPrimary && (
                          <span className="text-xs text-blue-600">Primary</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(barcode.barcodeType)}`}>
                      {barcode.barcodeType}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm text-gray-900">{barcode.itemName}</div>
                    <div className="text-xs text-gray-500">{barcode.itemCode}</div>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">{barcode.uom || '-'}</td>
                  <td className="px-3 py-2">
                    <div className="text-sm font-medium text-gray-900">{barcode.scanCount.toLocaleString()}</div>
                    {barcode.lastScanned && (
                      <div className="text-xs text-gray-500">Last: {barcode.lastScanned}</div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      barcode.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {barcode.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Edit3 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Edit</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Download className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BarcodeMaster;
