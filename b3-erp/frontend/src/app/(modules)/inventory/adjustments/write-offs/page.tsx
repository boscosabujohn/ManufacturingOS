'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Trash2,
  Package,
  Warehouse,
  Calendar,
  User,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface WriteOff {
  id: number;
  writeOffNumber: string;
  date: string;
  warehouse: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  reason: 'damaged' | 'obsolete' | 'expired' | 'lost' | 'other';
  reasonDetails: string;
  createdBy: string;
  status: 'draft' | 'pending-approval' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  batchNumber?: string;
}

export default function WriteOffsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedReason, setSelectedReason] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [writeOffs, setWriteOffs] = useState<WriteOff[]>([
    {
      id: 1,
      writeOffNumber: 'WO-2025-001',
      date: '2025-01-17',
      warehouse: 'Assembly Plant',
      itemCode: 'ITM-008',
      itemName: 'Gear Box Assembly',
      category: 'Component',
      quantity: 3,
      unitValue: 15000,
      totalValue: 45000,
      reason: 'damaged',
      reasonDetails: 'Damaged during handling - beyond repair',
      createdBy: 'Sarah Johnson',
      status: 'approved',
      approvedBy: 'Mike Davis',
      approvedDate: '2025-01-18',
      batchNumber: 'BATCH-2025-003'
    },
    {
      id: 2,
      writeOffNumber: 'WO-2025-002',
      date: '2025-01-20',
      warehouse: 'Main Warehouse',
      itemCode: 'ITM-015',
      itemName: 'Obsolete Motor V1',
      category: 'Component',
      quantity: 6,
      unitValue: 5400,
      totalValue: 32400,
      reason: 'obsolete',
      reasonDetails: 'Superseded by new model - no longer usable',
      createdBy: 'Mike Davis',
      status: 'pending-approval',
      batchNumber: 'BATCH-2024-087'
    },
    {
      id: 3,
      writeOffNumber: 'WO-2025-003',
      date: '2025-01-21',
      warehouse: 'FG Store',
      itemCode: 'FG-005',
      itemName: 'Loader Model LD100',
      category: 'Finished Goods',
      quantity: 1,
      unitValue: 280000,
      totalValue: 280000,
      reason: 'damaged',
      reasonDetails: 'Fire damage during storage - total loss',
      createdBy: 'Robert Lee',
      status: 'pending-approval'
    },
    {
      id: 4,
      writeOffNumber: 'WO-2025-004',
      date: '2025-01-21',
      warehouse: 'RM Store',
      itemCode: 'RM-012',
      itemName: 'Rubber Seals Batch',
      category: 'Raw Material',
      quantity: 150,
      unitValue: 45,
      totalValue: 6750,
      reason: 'expired',
      reasonDetails: 'Shelf life exceeded - quality deteriorated',
      createdBy: 'Emily Chen',
      status: 'draft',
      batchNumber: 'BATCH-2023-156'
    },
    {
      id: 5,
      writeOffNumber: 'WO-2025-005',
      date: '2025-01-22',
      warehouse: 'Assembly Plant',
      itemCode: 'ITM-022',
      itemName: 'Control Unit PCB',
      category: 'Component',
      quantity: 8,
      unitValue: 3200,
      totalValue: 25600,
      reason: 'lost',
      reasonDetails: 'Missing from inventory - suspected theft',
      createdBy: 'John Smith',
      status: 'pending-approval',
      batchNumber: 'BATCH-2025-011'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending-approval':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'draft':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'damaged':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'obsolete':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expired':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'lost':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'other':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalWriteOffs = writeOffs.length;
  const pendingApproval = writeOffs.filter(w => w.status === 'pending-approval').length;
  const totalValue = writeOffs.reduce((sum, w) => sum + w.totalValue, 0);
  const approvedThisMonth = writeOffs.filter(w => w.status === 'approved').length;

  const filteredWriteOffs = writeOffs.filter(wo => {
    const matchesSearch = wo.writeOffNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wo.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wo.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = selectedWarehouse === 'all' || wo.warehouse.toLowerCase().includes(selectedWarehouse.toLowerCase());
    const matchesReason = selectedReason === 'all' || wo.reason === selectedReason;
    const matchesStatus = selectedStatus === 'all' || wo.status === selectedStatus;
    
    return matchesSearch && matchesWarehouse && matchesReason && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Trash2 className="w-8 h-8 text-red-600" />
            <span>Inventory Write-Offs</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage inventory write-offs and disposals</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <Trash2 className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">{totalWriteOffs}</span>
          </div>
          <div className="text-sm font-medium text-red-700">Total Write-Offs</div>
          <div className="text-xs text-red-600 mt-1">This Month</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-900">{pendingApproval}</span>
          </div>
          <div className="text-sm font-medium text-yellow-700">Pending Approval</div>
          <div className="text-xs text-yellow-600 mt-1">Awaiting Review</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">₹{(totalValue / 100000).toFixed(1)}L</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Total Value Loss</div>
          <div className="text-xs text-orange-600 mt-1">All Write-Offs</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{approvedThisMonth}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Approved</div>
          <div className="text-xs text-green-600 mt-1">This Month</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search write-offs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Warehouses</option>
            <option value="main">Main Warehouse</option>
            <option value="assembly">Assembly Plant</option>
            <option value="fg">FG Store</option>
            <option value="rm">RM Store</option>
          </select>

          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Reasons</option>
            <option value="damaged">Damaged</option>
            <option value="obsolete">Obsolete</option>
            <option value="expired">Expired</option>
            <option value="lost">Lost/Theft</option>
            <option value="other">Other</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending-approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Write-Offs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Write-Off #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWriteOffs.map((wo) => (
                <tr key={wo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {wo.writeOffNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{wo.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{wo.itemName}</div>
                    <div className="text-xs text-gray-500">{wo.itemCode}</div>
                    {wo.batchNumber && (
                      <div className="text-xs text-blue-600 mt-1">Batch: {wo.batchNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Warehouse className="w-4 h-4 text-gray-400" />
                      <span>{wo.warehouse}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{wo.quantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-1 text-red-600 font-bold">
                      <TrendingDown className="w-5 h-5" />
                      <span>₹{(wo.totalValue / 1000).toFixed(1)}K</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getReasonColor(wo.reason)}`}>
                      {wo.reason.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="flex items-start space-x-1">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{wo.reasonDetails}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{wo.createdBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(wo.status)}`}>
                      {wo.status.replace('-', ' ').toUpperCase()}
                    </span>
                    {wo.approvedBy && (
                      <div className="text-xs text-gray-500 mt-1">
                        By {wo.approvedBy}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWriteOffs.length === 0 && (
          <div className="text-center py-12">
            <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No write-offs found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
