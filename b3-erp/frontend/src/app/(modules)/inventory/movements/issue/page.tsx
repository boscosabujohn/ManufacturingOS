'use client';

import React, { useState } from 'react';
import {
  PackageMinus,
  Factory,
  Calendar,
  User,
  Package,
  MapPin,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Issue {
  id: number;
  issueNumber: string;
  issueDate: string;
  issueType: 'production' | 'sales' | 'transfer' | 'project' | 'maintenance';
  destinationDocument: string;
  warehouse: string;
  issuedTo: string;
  issuedBy: string;
  itemCount: number;
  totalQuantity: number;
  status: 'pending' | 'partially-issued' | 'completed' | 'cancelled';
  priority: 'normal' | 'high' | 'urgent';
  expectedDate?: string;
}

export default function InventoryIssuePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 1,
      issueNumber: 'ISS-2025-001',
      issueDate: '2025-01-20',
      issueType: 'production',
      destinationDocument: 'WO-2025-085',
      warehouse: 'RM Store',
      issuedTo: 'Production Floor A',
      issuedBy: 'John Smith',
      itemCount: 12,
      totalQuantity: 385,
      status: 'completed',
      priority: 'normal'
    },
    {
      id: 2,
      issueNumber: 'ISS-2025-002',
      issueDate: '2025-01-21',
      issueType: 'sales',
      destinationDocument: 'SO-2025-142',
      warehouse: 'FG Store',
      issuedTo: 'Customer - ABC Corp',
      issuedBy: 'Sarah Johnson',
      itemCount: 5,
      totalQuantity: 12,
      status: 'pending',
      priority: 'high',
      expectedDate: '2025-01-22'
    },
    {
      id: 3,
      issueNumber: 'ISS-2025-003',
      issueDate: '2025-01-21',
      issueType: 'transfer',
      destinationDocument: 'TR-2025-015',
      warehouse: 'Main Warehouse',
      issuedTo: 'Assembly Plant',
      issuedBy: 'Mike Davis',
      itemCount: 8,
      totalQuantity: 245,
      status: 'partially-issued',
      priority: 'normal'
    },
    {
      id: 4,
      issueNumber: 'ISS-2025-004',
      issueDate: '2025-01-22',
      issueType: 'project',
      destinationDocument: 'PRJ-2025-012',
      warehouse: 'Main Warehouse',
      issuedTo: 'Site Installation Team',
      issuedBy: 'Emily Chen',
      itemCount: 15,
      totalQuantity: 180,
      status: 'completed',
      priority: 'urgent'
    },
    {
      id: 5,
      issueNumber: 'ISS-2025-005',
      issueDate: '2025-01-22',
      issueType: 'maintenance',
      destinationDocument: 'MAINT-2025-028',
      warehouse: 'Spares Store',
      issuedTo: 'Maintenance Department',
      issuedBy: 'Robert Lee',
      itemCount: 4,
      totalQuantity: 22,
      status: 'completed',
      priority: 'high'
    },
    {
      id: 6,
      issueNumber: 'ISS-2025-006',
      issueDate: '2025-01-22',
      issueType: 'production',
      destinationDocument: 'WO-2025-092',
      warehouse: 'RM Store',
      issuedTo: 'Production Floor B',
      issuedBy: 'John Smith',
      itemCount: 9,
      totalQuantity: 310,
      status: 'pending',
      priority: 'normal',
      expectedDate: '2025-01-23'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'partially-issued':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'pending':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'production':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'sales':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'transfer':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'project':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'maintenance':
        return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalIssues = issues.length;
  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  const completedToday = issues.filter(i => i.status === 'completed' && i.issueDate === '2025-01-22').length;
  const urgentIssues = issues.filter(i => i.priority === 'urgent' && i.status !== 'completed').length;

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.issueNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.destinationDocument.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.issuedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || issue.issueType === selectedType;
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
    const matchesWarehouse = selectedWarehouse === 'all' || issue.warehouse.toLowerCase().includes(selectedWarehouse.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus && matchesWarehouse;
  });

  return (
    <div className="p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <PackageMinus className="w-8 h-8 text-orange-600" />
            <span>Inventory Issues</span>
          </h1>
          <p className="text-gray-600 mt-1">Track and manage outgoing stock issues</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <PackageMinus className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{totalIssues}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Total Issues</div>
          <div className="text-xs text-orange-600 mt-1">This Month</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{pendingIssues}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Pending Issue</div>
          <div className="text-xs text-blue-600 mt-1">Awaiting Processing</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{completedToday}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Completed Today</div>
          <div className="text-xs text-green-600 mt-1">Issues Processed</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">{urgentIssues}</span>
          </div>
          <div className="text-sm font-medium text-red-700">Urgent</div>
          <div className="text-xs text-red-600 mt-1">High Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issues..."
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
            <option value="production">Production</option>
            <option value="sales">Sales</option>
            <option value="transfer">Transfer</option>
            <option value="project">Project</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="partially-issued">Partially Issued</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Warehouses</option>
            <option value="main">Main Warehouse</option>
            <option value="rm">RM Store</option>
            <option value="fg">FG Store</option>
            <option value="spares">Spares Store</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue #</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination Doc</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued To</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items/Quantity</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {issue.issueNumber}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{issue.issueDate}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(issue.issueType)}`}>
                      {issue.issueType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {issue.destinationDocument}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{issue.warehouse}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Factory className="w-4 h-4 text-gray-400" />
                      <span>{issue.issuedTo}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{issue.itemCount} items</div>
                        <div className="text-xs text-gray-500">{issue.totalQuantity} units</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 w-fit ${getPriorityColor(issue.priority)}`}>
                      {issue.priority === 'urgent' && <AlertCircle className="w-3 h-3" />}
                      <span className="uppercase">{issue.priority}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
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

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <PackageMinus className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500">No issues found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
