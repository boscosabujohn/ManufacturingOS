'use client';

import React, { useState } from 'react';
import {
  Settings,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  FileText,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Adjustment {
  id: number;
  adjustmentNumber: string;
  date: string;
  warehouse: string;
  type: 'quantity' | 'value' | 'write-off';
  reason: string;
  itemsCount: number;
  adjustmentValue: number;
  adjustmentType: 'increase' | 'decrease';
  createdBy: string;
  status: 'draft' | 'pending-approval' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
}

export default function AdjustmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  const [adjustments, setAdjustments] = useState<Adjustment[]>([
    {
      id: 1,
      adjustmentNumber: 'ADJ-2025-001',
      date: '2025-01-15',
      warehouse: 'Main Warehouse',
      type: 'quantity',
      reason: 'Physical Count Variance',
      itemsCount: 5,
      adjustmentValue: 25000,
      adjustmentType: 'increase',
      createdBy: 'John Smith',
      status: 'approved',
      approvedBy: 'Mike Davis',
      approvedDate: '2025-01-16'
    },
    {
      id: 2,
      adjustmentNumber: 'ADJ-2025-002',
      date: '2025-01-17',
      warehouse: 'Assembly Plant',
      type: 'write-off',
      reason: 'Damaged Goods',
      itemsCount: 3,
      adjustmentValue: 45000,
      adjustmentType: 'decrease',
      createdBy: 'Sarah Johnson',
      status: 'pending-approval'
    },
    {
      id: 3,
      adjustmentNumber: 'ADJ-2025-003',
      date: '2025-01-18',
      warehouse: 'FG Store',
      type: 'value',
      reason: 'Price Correction',
      itemsCount: 8,
      adjustmentValue: 18500,
      adjustmentType: 'increase',
      createdBy: 'Robert Lee',
      status: 'approved',
      approvedBy: 'Emily Chen',
      approvedDate: '2025-01-19'
    },
    {
      id: 4,
      adjustmentNumber: 'ADJ-2025-004',
      date: '2025-01-19',
      warehouse: 'Main Warehouse',
      type: 'quantity',
      reason: 'System Error Correction',
      itemsCount: 2,
      adjustmentValue: 12000,
      adjustmentType: 'decrease',
      createdBy: 'Emily Chen',
      status: 'draft'
    },
    {
      id: 5,
      adjustmentNumber: 'ADJ-2025-005',
      date: '2025-01-20',
      warehouse: 'Assembly Plant',
      type: 'write-off',
      reason: 'Obsolete Inventory',
      itemsCount: 6,
      adjustmentValue: 32000,
      adjustmentType: 'decrease',
      createdBy: 'Mike Davis',
      status: 'pending-approval'
    },
    {
      id: 6,
      adjustmentNumber: 'ADJ-2025-006',
      date: '2025-01-20',
      warehouse: 'FG Store',
      type: 'quantity',
      reason: 'Cycle Count Adjustment',
      itemsCount: 4,
      adjustmentValue: 8500,
      adjustmentType: 'increase',
      createdBy: 'Sarah Johnson',
      status: 'rejected'
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quantity':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'value':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'write-off':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalAdjustments = adjustments.length;
  const pendingApproval = adjustments.filter(a => a.status === 'pending-approval').length;
  const totalValue = adjustments.reduce((sum, a) => sum + a.adjustmentValue, 0);
  const approvedThisMonth = adjustments.filter(a => a.status === 'approved').length;

  const filteredAdjustments = adjustments.filter(adj => {
    const matchesSearch = adj.adjustmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         adj.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         adj.warehouse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || adj.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || adj.status === selectedStatus;
    const matchesWarehouse = selectedWarehouse === 'all' || adj.warehouse.toLowerCase().includes(selectedWarehouse.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus && matchesWarehouse;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="w-8 h-8 text-blue-600" />
            <span>Inventory Adjustments</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage inventory quantity and value adjustments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Adjustment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Settings className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{totalAdjustments}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Total Adjustments</div>
          <div className="text-xs text-blue-600 mt-1">This Month</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-900">{pendingApproval}</span>
          </div>
          <div className="text-sm font-medium text-yellow-700">Pending Approval</div>
          <div className="text-xs text-yellow-600 mt-1">Awaiting Review</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">₹{(totalValue / 100000).toFixed(1)}L</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Total Value</div>
          <div className="text-xs text-purple-600 mt-1">All Adjustments</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{approvedThisMonth}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Approved</div>
          <div className="text-xs text-green-600 mt-1">This Month</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 flex flex-col items-center space-y-2">
            <Settings className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium">Quantity Adjustment</span>
          </button>
          <button className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 flex flex-col items-center space-y-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium">Value Adjustment</span>
          </button>
          <button className="p-4 border border-red-200 rounded-lg hover:bg-red-50 flex flex-col items-center space-y-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-sm font-medium">Write-Off</span>
          </button>
          <button className="p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 flex flex-col items-center space-y-2">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-sm font-medium">View Approvals</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search adjustments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="quantity">Quantity</option>
            <option value="value">Value</option>
            <option value="write-off">Write-Off</option>
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
        </div>
      </div>

      {/* Adjustments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjustment #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdjustments.map((adj) => (
                <tr key={adj.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {adj.adjustmentNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{adj.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {adj.warehouse}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(adj.type)}`}>
                      {adj.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>{adj.reason}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {adj.itemsCount} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={`flex items-center space-x-1 ${adj.adjustmentType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {adj.adjustmentType === 'increase' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-medium">₹{(adj.adjustmentValue / 1000).toFixed(1)}K</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{adj.createdBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(adj.status)}`}>
                      {adj.status.replace('-', ' ').toUpperCase()}
                    </span>
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

        {filteredAdjustments.length === 0 && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No adjustments found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
