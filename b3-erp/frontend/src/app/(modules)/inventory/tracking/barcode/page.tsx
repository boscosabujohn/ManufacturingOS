'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, QrCode, Scan, Package, MapPin, Calendar, Download, Upload, Printer, CheckCircle } from 'lucide-react';

interface BarcodeItem {
  id: string;
  itemCode: string;
  itemName: string;
  barcode: string;
  barcodeType: 'EAN-13' | 'Code-128' | 'QR Code' | 'Data Matrix';
  quantity: number;
  uom: string;
  location: string;
  batchNumber: string;
  serialNumber: string;
  lastScanned: string;
  scanCount: number;
  status: 'active' | 'inactive' | 'damaged';
}

export default function BarcodeTrackingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [scanInput, setScanInput] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [scanMode, setScanMode] = useState(false);

  const barcodeItems: BarcodeItem[] = [
    {
      id: '1',
      itemCode: 'RM-001',
      itemName: 'Steel Sheet 1mm',
      barcode: '8901234567890',
      barcodeType: 'EAN-13',
      quantity: 450,
      uom: 'Sheets',
      location: 'Zone A - Bin A-01-R01',
      batchNumber: 'BATCH-2025-001',
      serialNumber: '',
      lastScanned: '2025-10-20 14:30:00',
      scanCount: 127,
      status: 'active'
    },
    {
      id: '2',
      itemCode: 'CP-102',
      itemName: 'Electric Motor 5HP',
      barcode: 'MTR5HP2024001',
      barcodeType: 'Code-128',
      quantity: 15,
      uom: 'Nos',
      location: 'Zone B - Bin B-02-R01',
      batchNumber: '',
      serialNumber: 'EM5HP-2024-001',
      lastScanned: '2025-10-19 10:15:00',
      scanCount: 45,
      status: 'active'
    },
    {
      id: '3',
      itemCode: 'FG-201',
      itemName: 'Motor Housing Complete',
      barcode: 'QR-MH201-2025',
      barcodeType: 'QR Code',
      quantity: 145,
      uom: 'Nos',
      location: 'Zone C - Bin C-01-R02',
      batchNumber: 'BATCH-2025-089',
      serialNumber: '',
      lastScanned: '2025-10-21 09:00:00',
      scanCount: 203,
      status: 'active'
    },
    {
      id: '4',
      itemCode: 'RM-032',
      itemName: 'Brass Rod 12mm',
      barcode: '8902345678901',
      barcodeType: 'EAN-13',
      quantity: 180,
      uom: 'Pcs',
      location: 'Zone A - Bin A-02-R03',
      batchNumber: 'BATCH-2024-089',
      serialNumber: '',
      lastScanned: '2025-10-18 16:45:00',
      scanCount: 78,
      status: 'active'
    },
    {
      id: '5',
      itemCode: 'CS-015',
      itemName: 'Cutting Oil Grade A',
      barcode: 'DM-CS015-2025',
      barcodeType: 'Data Matrix',
      quantity: 30,
      uom: 'Ltrs',
      location: 'Zone D - Bin D-01-R05',
      batchNumber: 'BATCH-2024-145',
      serialNumber: '',
      lastScanned: '2025-10-15 11:20:00',
      scanCount: 34,
      status: 'active'
    },
    {
      id: '6',
      itemCode: 'RM-045',
      itemName: 'Aluminum Plate 5mm',
      barcode: '8903456789012',
      barcodeType: 'EAN-13',
      quantity: 0,
      uom: 'Sheets',
      location: 'Zone A - Bin A-03-R01',
      batchNumber: 'BATCH-2025-034',
      serialNumber: '',
      lastScanned: '2025-09-30 14:00:00',
      scanCount: 156,
      status: 'inactive'
    },
    {
      id: '7',
      itemCode: 'FG-305',
      itemName: 'Gearbox Assembly',
      barcode: 'QR-GB305-2025',
      barcodeType: 'QR Code',
      quantity: 67,
      uom: 'Nos',
      location: 'Zone C - Bin C-02-R01',
      batchNumber: '',
      serialNumber: 'GB-2025-001',
      lastScanned: '2025-10-20 08:30:00',
      scanCount: 89,
      status: 'active'
    },
    {
      id: '8',
      itemCode: 'CP-089',
      itemName: 'Bearing 6205-2RS',
      barcode: 'BR62052RS2025',
      barcodeType: 'Code-128',
      quantity: 250,
      uom: 'Nos',
      location: 'Zone B - Bin B-01-R04',
      batchNumber: 'BATCH-2025-112',
      serialNumber: '',
      lastScanned: '2025-10-21 07:15:00',
      scanCount: 312,
      status: 'active'
    },
    {
      id: '9',
      itemCode: 'RM-078',
      itemName: 'Copper Wire 2.5mm',
      barcode: 'DAMAGED-001',
      barcodeType: 'Code-128',
      quantity: 45,
      uom: 'Kg',
      location: 'Zone A - Bin A-04-R02',
      batchNumber: 'BATCH-2025-045',
      serialNumber: '',
      lastScanned: '2025-10-10 12:00:00',
      scanCount: 23,
      status: 'damaged'
    },
    {
      id: '10',
      itemCode: 'CS-067',
      itemName: 'Grinding Wheel 150mm',
      barcode: 'DM-GW150-2025',
      barcodeType: 'Data Matrix',
      quantity: 120,
      uom: 'Nos',
      location: 'Zone D - Bin D-02-R03',
      batchNumber: 'BATCH-2025-078',
      serialNumber: '',
      lastScanned: '2025-10-19 15:30:00',
      scanCount: 198,
      status: 'active'
    }
  ];

  const filteredItems = barcodeItems.filter(item => {
    const matchesSearch = item.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.barcodeType === filterType;
    return matchesSearch && matchesType;
  });

  const handleScan = () => {
    if (scanInput.trim()) {
      const foundItem = barcodeItems.find(item =>
        item.barcode.toLowerCase() === scanInput.toLowerCase()
      );

      if (foundItem) {
        alert(`Item Found!\n\nItem: ${foundItem.itemName}\nCode: ${foundItem.itemCode}\nLocation: ${foundItem.location}\nQuantity: ${foundItem.quantity} ${foundItem.uom}`);
        setScanInput('');
      } else {
        alert('Barcode not found in the system.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'damaged': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getBarcodeTypeColor = (type: string) => {
    switch (type) {
      case 'EAN-13': return 'bg-blue-100 text-blue-700';
      case 'Code-128': return 'bg-purple-100 text-purple-700';
      case 'QR Code': return 'bg-indigo-100 text-indigo-700';
      case 'Data Matrix': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Barcode Tracking</h1>
            <p className="text-sm text-gray-500 mt-1">Scan and manage inventory barcodes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Printer className="w-4 h-4" />
            <span>Print Labels</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Barcodes</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{barcodeItems.length}</p>
            </div>
            <QrCode className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {barcodeItems.filter(i => i.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Scans</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {barcodeItems.reduce((sum, item) => sum + item.scanCount, 0)}
              </p>
            </div>
            <Scan className="w-6 h-6 text-purple-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Damaged</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {barcodeItems.filter(i => i.status === 'damaged').length}
              </p>
            </div>
            <Package className="w-6 h-6 text-red-700" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Scan className="w-5 h-5 text-blue-600" />
            Quick Scan
          </h3>
          <button
            onClick={() => setScanMode(!scanMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              scanMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {scanMode ? 'Scanner Active' : 'Activate Scanner'}
          </button>
        </div>

        {scanMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <QrCode className="w-8 h-8 text-blue-600" />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Scan or enter barcode..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                  className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
                  autoFocus
                />
                <button
                  onClick={handleScan}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Lookup
                </button>
              </div>
            </div>
            <p className="text-sm text-blue-700 mt-3">
              Scan the barcode using a scanner or manually enter the barcode number to lookup item details
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by barcode, item code, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Barcode Types</option>
            <option value="EAN-13">EAN-13</option>
            <option value="Code-128">Code-128</option>
            <option value="QR Code">QR Code</option>
            <option value="Data Matrix">Data Matrix</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barcode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch/Serial</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Scanned</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Scan Count</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono font-bold text-gray-900">{item.barcode}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getBarcodeTypeColor(item.barcodeType)}`}>
                      {item.barcodeType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{item.itemCode}</div>
                    <div className="text-xs text-gray-500">{item.itemName}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                    {item.quantity} {item.uom}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {item.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {item.batchNumber && <div>Batch: {item.batchNumber}</div>}
                    {item.serialNumber && <div>S/N: {item.serialNumber}</div>}
                    {!item.batchNumber && !item.serialNumber && <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {new Date(item.lastScanned).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                    {item.scanCount}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No barcodes found matching your criteria</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Barcode Management Tips:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Ensure barcodes are clearly visible and undamaged for accurate scanning</li>
          <li>Use appropriate barcode types based on data requirements (EAN-13 for products, QR for complex data)</li>
          <li>Regularly verify barcode accuracy to prevent inventory discrepancies</li>
          <li>Replace damaged barcode labels immediately to maintain tracking integrity</li>
          <li>Maintain a backup database of all barcode assignments</li>
        </ul>
      </div>
    </div>
  );
}
