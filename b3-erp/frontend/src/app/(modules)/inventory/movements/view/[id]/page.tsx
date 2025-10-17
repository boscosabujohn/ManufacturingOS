'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Package, Calendar, User, FileText, MapPin,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  XCircle, Clock, Truck, RefreshCw, Download, Activity
} from 'lucide-react';

interface StockMovement {
  id: string;
  movementNumber: string;
  movementType: 'receipt' | 'issue' | 'transfer_in' | 'transfer_out' | 'adjustment' | 'return';
  movementDate: string;
  movementTime: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  uom: string;
  unitCost: number;
  totalValue: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceType: string;
  referenceNumber: string;
  fromLocation?: string;
  toLocation?: string;
  warehouse: string;
  reason: string;
  remarks?: string;
  batchNumber?: string;
  serialNumbers?: string[];
  performedBy: string;
  approvedBy?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'completed' | 'cancelled';
  createdDate: string;
  completedDate?: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export default function StockMovementViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'activity'>('details');

  // Mock data
  const movement: StockMovement = {
    id: params.id,
    movementNumber: 'SM-2025-10-001234',
    movementType: 'receipt',
    movementDate: '2025-10-16',
    movementTime: '14:30:45',
    itemCode: 'RM-SS304-2MM',
    itemName: 'Stainless Steel Sheet 304 - 2mm Thickness',
    category: 'Raw Materials',
    quantity: 500,
    uom: 'KG',
    unitCost: 185.50,
    totalValue: 92750.00,
    balanceBefore: 2075,
    balanceAfter: 2575,
    referenceType: 'Purchase Order',
    referenceNumber: 'PO-2025-5678',
    toLocation: 'RM-A-01-AA-001',
    warehouse: 'Main Warehouse - Pune',
    reason: 'Purchase Receipt from Tata Steel',
    remarks: 'Quality inspection completed. Material meets specifications. Batch certified.',
    batchNumber: 'BATCH-TS-2025-10-001',
    performedBy: 'Sunita Reddy',
    approvedBy: 'Rahul Sharma',
    status: 'completed',
    createdDate: '2025-10-15 16:45:00',
    completedDate: '2025-10-16 14:30:45',
    documents: [
      { id: 'D1', name: 'Purchase_Order_PO-2025-5678.pdf', type: 'PDF', size: '245 KB', uploadedBy: 'Sunita Reddy', uploadedDate: '2025-10-15 16:50' },
      { id: 'D2', name: 'Material_Test_Certificate.pdf', type: 'PDF', size: '180 KB', uploadedBy: 'Sunita Reddy', uploadedDate: '2025-10-16 10:15' },
      { id: 'D3', name: 'Delivery_Challan_Tata_Steel.pdf', type: 'PDF', size: '156 KB', uploadedBy: 'Sunita Reddy', uploadedDate: '2025-10-16 14:20' }
    ]
  };

  const activityLog: ActivityLog[] = [
    { id: 'A1', timestamp: '2025-10-16 14:30:45', action: 'Movement Completed', user: 'Sunita Reddy', details: 'Stock movement completed and inventory updated', status: 'success' },
    { id: 'A2', timestamp: '2025-10-16 14:25:30', action: 'Approval Granted', user: 'Rahul Sharma', details: 'Movement approved for completion', status: 'success' },
    { id: 'A3', timestamp: '2025-10-16 14:20:15', action: 'Document Uploaded', user: 'Sunita Reddy', details: 'Delivery challan uploaded', status: 'success' },
    { id: 'A4', timestamp: '2025-10-16 10:15:22', action: 'Document Uploaded', user: 'Sunita Reddy', details: 'Material test certificate uploaded', status: 'success' },
    { id: 'A5', timestamp: '2025-10-16 09:00:00', action: 'Approval Requested', user: 'Sunita Reddy', details: 'Movement submitted for approval', status: 'success' },
    { id: 'A6', timestamp: '2025-10-15 16:50:10', action: 'Document Uploaded', user: 'Sunita Reddy', details: 'Purchase order document uploaded', status: 'success' },
    { id: 'A7', timestamp: '2025-10-15 16:45:00', action: 'Movement Created', user: 'Sunita Reddy', details: 'Stock movement record created', status: 'success' }
  ];

  const getMovementTypeConfig = (type: string) => {
    switch (type) {
      case 'receipt':
        return { label: 'Receipt', color: 'bg-green-100 text-green-700', icon: <TrendingUp className="w-5 h-5" />, sign: '+' };
      case 'issue':
        return { label: 'Issue', color: 'bg-red-100 text-red-700', icon: <TrendingDown className="w-5 h-5" />, sign: '-' };
      case 'transfer_in':
        return { label: 'Transfer In', color: 'bg-blue-100 text-blue-700', icon: <TrendingUp className="w-5 h-5" />, sign: '+' };
      case 'transfer_out':
        return { label: 'Transfer Out', color: 'bg-orange-100 text-orange-700', icon: <TrendingDown className="w-5 h-5" />, sign: '-' };
      case 'adjustment':
        return { label: 'Adjustment', color: 'bg-purple-100 text-purple-700', icon: <RefreshCw className="w-5 h-5" />, sign: '±' };
      case 'return':
        return { label: 'Return', color: 'bg-teal-100 text-teal-700', icon: <TrendingUp className="w-5 h-5" />, sign: '+' };
      default:
        return { label: type, color: 'bg-gray-100 text-gray-700', icon: <Package className="w-5 h-5" />, sign: '' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-5 h-5" /> };
      case 'approved':
        return { label: 'Approved', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="w-5 h-5" /> };
      case 'pending_approval':
        return { label: 'Pending Approval', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-5 h-5" /> };
      case 'draft':
        return { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: <FileText className="w-5 h-5" /> };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-5 h-5" /> };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: <AlertTriangle className="w-5 h-5" /> };
    }
  };

  const movementTypeConfig = getMovementTypeConfig(movement.movementType);
  const statusConfig = getStatusConfig(movement.status);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Stock Movement</h1>
              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${movementTypeConfig.color}`}>
                {movementTypeConfig.icon}
                {movementTypeConfig.label}
              </span>
              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span className="font-mono font-semibold">{movement.movementNumber}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {movement.movementDate} {movement.movementTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {movement.performedBy}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className={`p-6 rounded-xl text-white ${
          movement.movementType === 'receipt' || movement.movementType === 'transfer_in' || movement.movementType === 'return'
            ? 'bg-gradient-to-br from-green-500 to-green-600'
            : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}>
          <div className="flex items-center justify-between mb-2">
            {movementTypeConfig.icon}
            <span className="text-2xl font-bold">{movementTypeConfig.sign}</span>
          </div>
          <div className="text-3xl font-bold mb-1">{movement.quantity.toLocaleString()}</div>
          <div className="text-sm opacity-90">Quantity ({movement.uom})</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{movement.balanceBefore.toLocaleString()}</div>
          <div className="text-blue-100 text-sm">Balance Before</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{movement.balanceAfter.toLocaleString()}</div>
          <div className="text-purple-100 text-sm">Balance After</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">₹</span>
            <span className="text-sm opacity-90">per {movement.uom}</span>
          </div>
          <div className="text-3xl font-bold mb-1">₹{movement.unitCost.toFixed(2)}</div>
          <div className="text-orange-100 text-sm">Unit Cost</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">₹</span>
          </div>
          <div className="text-3xl font-bold mb-1">₹{(movement.totalValue / 1000).toFixed(0)}K</div>
          <div className="text-indigo-100 text-sm">Total Value</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Movement Details
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Documents ({movement.documents.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Activity Log
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Movement Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Movement Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Movement Number</span>
                  <span className="font-mono font-semibold text-gray-900">{movement.movementNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Movement Type</span>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${movementTypeConfig.color}`}>
                    {movementTypeConfig.label}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Movement Date & Time</span>
                  <span className="font-medium text-gray-900">{movement.movementDate} {movement.movementTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Reference Type</span>
                  <span className="font-medium text-gray-900">{movement.referenceType}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Reference Number</span>
                  <span className="font-mono font-semibold text-blue-600">{movement.referenceNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Item Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Item Code</span>
                  <span className="font-mono font-semibold text-gray-900">{movement.itemCode}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Item Name</span>
                  <span className="font-medium text-gray-900">{movement.itemName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{movement.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-bold text-lg text-gray-900">{movement.quantity} {movement.uom}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Unit Cost</span>
                  <span className="font-semibold text-gray-900">₹{movement.unitCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-bold text-lg text-green-700">₹{movement.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Balance Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Stock Balance Impact
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">Balance Before</div>
                <div className="text-3xl font-bold text-blue-900">{movement.balanceBefore}</div>
                <div className="text-xs text-blue-600 mt-1">{movement.uom}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 flex flex-col justify-center">
                <div className="text-sm text-purple-600 mb-1">Change</div>
                <div className={`text-3xl font-bold ${
                  movement.movementType === 'receipt' || movement.movementType === 'transfer_in' || movement.movementType === 'return'
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {movementTypeConfig.sign}{movement.quantity}
                </div>
                <div className="text-xs text-purple-600 mt-1">{movement.uom}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 mb-1">Balance After</div>
                <div className="text-3xl font-bold text-green-900">{movement.balanceAfter}</div>
                <div className="text-xs text-green-600 mt-1">{movement.uom}</div>
              </div>
            </div>
          </div>

          {/* Location & Warehouse */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Location Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Warehouse</span>
                  <span className="font-semibold text-gray-900">{movement.warehouse}</span>
                </div>
                {movement.fromLocation && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">From Location</span>
                    <span className="font-mono font-medium text-gray-900">{movement.fromLocation}</span>
                  </div>
                )}
                {movement.toLocation && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">To Location</span>
                    <span className="font-mono font-medium text-gray-900">{movement.toLocation}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Personnel Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Performed By</span>
                  <span className="font-semibold text-gray-900">{movement.performedBy}</span>
                </div>
                {movement.approvedBy && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Approved By</span>
                    <span className="font-semibold text-gray-900">{movement.approvedBy}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Created Date</span>
                  <span className="font-medium text-gray-900">{movement.createdDate}</span>
                </div>
                {movement.completedDate && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Completed Date</span>
                    <span className="font-medium text-gray-900">{movement.completedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {(movement.batchNumber || movement.serialNumbers) && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tracking Information</h3>
              <div className="grid grid-cols-2 gap-6">
                {movement.batchNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Batch Number</label>
                    <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="font-mono font-bold text-blue-900">{movement.batchNumber}</span>
                    </div>
                  </div>
                )}
                {movement.serialNumbers && movement.serialNumbers.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Serial Numbers</label>
                    <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {movement.serialNumbers.map((serial, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">
                            {serial}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reason & Remarks */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reason & Remarks</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Reason</label>
                <p className="text-gray-900">{movement.reason}</p>
              </div>
              {movement.remarks && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Additional Remarks</label>
                  <p className="text-gray-700 text-sm leading-relaxed">{movement.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Attached Documents</h3>
            <span className="text-sm text-gray-600">{movement.documents.length} document(s)</span>
          </div>
          {movement.documents.length > 0 ? (
            <div className="space-y-3">
              {movement.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{doc.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedDate}
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No documents attached</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Activity Timeline
          </h3>
          <div className="space-y-4">
            {activityLog.map((log, index) => (
              <div key={log.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    log.status === 'success' ? 'bg-green-100 text-green-600' :
                    log.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {log.status === 'success' ? <CheckCircle className="w-5 h-5" /> :
                     log.status === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                     <XCircle className="w-5 h-5" />}
                  </div>
                  {index < activityLog.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{log.action}</h4>
                    <span className="text-xs text-gray-500">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                  <p className="text-xs text-gray-500">by {log.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
