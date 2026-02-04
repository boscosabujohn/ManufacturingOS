'use client';

import React, { useState, useMemo } from 'react';
import {
  Package, Plus, Search, Edit2, Trash2, CheckCircle2,
  XCircle, Calendar, Hash, AlertCircle, Clock,
  MapPin, Thermometer, TrendingDown, Box, FileText
} from 'lucide-react';

interface BatchLot {
  id: string;
  batchNumber: string;
  lotNumber: string;
  item: string;
  itemCode: string;
  quantity: number;
  uom: string;
  manufacturingDate: Date;
  expiryDate?: Date;
  shelfLife?: number;
  supplier?: string;
  poNumber?: string;
  warehouse: string;
  location: string;
  productionOrder?: string;
  qualityStatus: 'Approved' | 'Pending' | 'Rejected' | 'On Hold';
  attributes: {
    color?: string;
    grade?: string;
    revision?: string;
    serialRange?: string;
  };
  traceability: {
    rawMaterialBatches?: string[];
    workOrders?: string[];
    operators?: string[];
  };
  testing: {
    inspectionDate?: Date;
    inspector?: string;
    testResults?: string;
    certificateNumber?: string;
  };
  status: 'Active' | 'Consumed' | 'Quarantined' | 'Expired' | 'Returned';
  notes: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

const mockBatches: BatchLot[] = [
  {
    id: '1',
    batchNumber: 'BATCH-2024-001',
    lotNumber: 'LOT-A-12345',
    item: 'Steel Sheet - Grade 304',
    itemCode: 'RM-STL-304-001',
    quantity: 5000,
    uom: 'kg',
    manufacturingDate: new Date('2024-01-15'),
    expiryDate: new Date('2026-01-15'),
    shelfLife: 730,
    supplier: 'Premium Steel Corp',
    poNumber: 'PO-2024-0123',
    warehouse: 'Main Warehouse',
    location: 'Zone A - Rack 12',
    qualityStatus: 'Approved',
    attributes: {
      grade: '304 Stainless Steel',
      revision: 'Rev 2',
      serialRange: 'SS-001 to SS-100'
    },
    traceability: {
      rawMaterialBatches: ['RM-BATCH-2023-458'],
      operators: ['John Doe', 'Jane Smith']
    },
    testing: {
      inspectionDate: new Date('2024-01-16'),
      inspector: 'QC Inspector - Mike',
      testResults: 'All parameters within specification',
      certificateNumber: 'QC-CERT-2024-001'
    },
    status: 'Active',
    notes: 'High quality batch, suitable for critical applications',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      createdBy: 'Warehouse Manager',
      updatedBy: 'QC Inspector'
    }
  },
  {
    id: '2',
    batchNumber: 'BATCH-2024-002',
    lotNumber: 'LOT-B-45678',
    item: 'Hydraulic Oil ISO 68',
    itemCode: 'CONS-OIL-068',
    quantity: 200,
    uom: 'liters',
    manufacturingDate: new Date('2024-02-01'),
    expiryDate: new Date('2025-02-01'),
    shelfLife: 365,
    supplier: 'Lubricants International',
    poNumber: 'PO-2024-0245',
    warehouse: 'Chemical Storage',
    location: 'Hazmat Zone - B3',
    productionOrder: 'WO-2024-156',
    qualityStatus: 'Approved',
    attributes: {
      grade: 'Premium Grade',
      color: 'Amber'
    },
    traceability: {
      rawMaterialBatches: ['BASE-OIL-2024-12', 'ADDITIVE-PKG-456']
    },
    testing: {
      inspectionDate: new Date('2024-02-02'),
      inspector: 'Chemical Analyst - Sarah',
      testResults: 'Viscosity and additives within spec',
      certificateNumber: 'LAB-CERT-2024-045'
    },
    status: 'Active',
    notes: 'Store in cool, dry place away from direct sunlight',
    metadata: {
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-02'),
      createdBy: 'Receiving Clerk',
      updatedBy: 'Lab Technician'
    }
  },
  {
    id: '3',
    batchNumber: 'BATCH-2024-003',
    lotNumber: 'LOT-C-78901',
    item: 'Electronic Component - PCB',
    itemCode: 'COMP-PCB-2024',
    quantity: 1000,
    uom: 'pieces',
    manufacturingDate: new Date('2024-03-10'),
    supplier: 'Electronics Mfg Ltd',
    warehouse: 'Electronics Inventory',
    location: 'ESD Zone - Shelf 45',
    qualityStatus: 'On Hold',
    attributes: {
      revision: 'Rev 3.1',
      serialRange: 'PCB-10000 to PCB-11000'
    },
    traceability: {
      rawMaterialBatches: ['SUBSTRATE-2024-08', 'SOLDER-2024-12']
    },
    testing: {
      inspectionDate: new Date('2024-03-11'),
      inspector: 'Electronics QA - Tom',
      testResults: 'Minor discrepancies found, awaiting resolution'
    },
    status: 'Quarantined',
    notes: 'On hold pending resolution of assembly issues',
    metadata: {
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-11'),
      createdBy: 'Receiving Manager',
      updatedBy: 'QA Manager'
    }
  }
];

export default function BatchLotMaster() {
  const [batches, setBatches] = useState<BatchLot[]>(mockBatches);
  const [selectedBatch, setSelectedBatch] = useState<BatchLot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterQualityStatus, setFilterQualityStatus] = useState<string>('All');

  const handleEdit = (batch: BatchLot) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this batch/lot?')) {
      setBatches(batches.filter(b => b.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Consumed': { bg: 'bg-gray-100', text: 'text-gray-800', icon: Box },
      'Quarantined': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      'Expired': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      'Returned': { bg: 'bg-purple-100', text: 'text-purple-800', icon: TrendingDown }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const getQualityBadge = (qualityStatus: string) => {
    const qualityConfig = {
      'Approved': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      'On Hold': { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertCircle }
    };
    const config = qualityConfig[qualityStatus as keyof typeof qualityConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {qualityStatus}
      </span>
    );
  };

  const getDaysUntilExpiry = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    const days = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return <span className="text-red-600 font-medium">Expired</span>;
    if (days < 30) return <span className="text-orange-600 font-medium">{days} days</span>;
    if (days < 90) return <span className="text-yellow-600">{days} days</span>;
    return <span className="text-green-600">{days} days</span>;
  };

  const filteredBatches = useMemo(() => {
    return batches.filter(batch => {
      const matchesSearch = batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           batch.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           batch.item.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || batch.status === filterStatus;
      const matchesQuality = filterQualityStatus === 'All' || batch.qualityStatus === filterQualityStatus;
      return matchesSearch && matchesStatus && matchesQuality;
    });
  }, [batches, searchTerm, filterStatus, filterQualityStatus]);

  return (
    <div className="p-6 ">
      <div className="mb-3">
        <h2 className="text-2xl font-bold mb-2">Batch/Lot Master</h2>
        <p className="text-gray-600">Manage production batches and lot traceability</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search batches/lots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Consumed">Consumed</option>
                <option value="Quarantined">Quarantined</option>
                <option value="Expired">Expired</option>
                <option value="Returned">Returned</option>
              </select>
              <select
                value={filterQualityStatus}
                onChange={(e) => setFilterQualityStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Quality Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedBatch(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Batch/Lot
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch/Lot Info
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Hash className="h-3 w-3 text-gray-400" />
                        {batch.batchNumber}
                      </div>
                      <div className="text-xs text-gray-500">Lot: {batch.lotNumber}</div>
                      {batch.supplier && (
                        <div className="text-xs text-gray-400">{batch.supplier}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div>
                      <div className="text-sm text-gray-900">{batch.item}</div>
                      <div className="text-xs text-gray-500">{batch.itemCode}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm font-medium">
                      {batch.quantity.toLocaleString()} {batch.uom}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {batch.warehouse}
                      </div>
                      <div className="text-xs text-gray-500">{batch.location}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>Mfg: {batch.manufacturingDate.toLocaleDateString()}</span>
                      </div>
                      {batch.expiryDate && (
                        <div className="mt-1">
                          <span className="text-gray-500">Expires: </span>
                          {getDaysUntilExpiry(batch.expiryDate)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {getQualityBadge(batch.qualityStatus)}
                  </td>
                  <td className="px-3 py-2">
                    {getStatusBadge(batch.status)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(batch)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(batch.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedBatch ? 'Edit Batch/Lot' : 'Add New Batch/Lot'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch Number *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedBatch?.batchNumber}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="BATCH-YYYY-NNN"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lot Number *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedBatch?.lotNumber}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="LOT-X-NNNNN"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Code *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedBatch?.itemCode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Select item"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedBatch?.quantity}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UOM *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedBatch?.uom}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="kg"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warehouse *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedBatch?.warehouse}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Select warehouse"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedBatch?.location}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Zone-Rack-Bin"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quality Status
                    </label>
                    <select 
                      defaultValue={selectedBatch?.qualityStatus || 'Pending'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select 
                      defaultValue={selectedBatch?.status || 'Active'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Consumed">Consumed</option>
                      <option value="Quarantined">Quarantined</option>
                      <option value="Expired">Expired</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    defaultValue={selectedBatch?.notes}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Batch/Lot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
