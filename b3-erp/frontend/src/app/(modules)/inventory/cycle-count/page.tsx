'use client';

import React, { useState } from 'react';
import {
  ClipboardList,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  BarChart3
} from 'lucide-react';

interface CycleCount {
  id: number;
  countNumber: string;
  warehouse: string;
  zone: string;
  countType: 'ABC' | 'Random' | 'Full' | 'Spot';
  scheduledDate: string;
  assignedTo: string;
  itemsToCount: number;
  itemsCounted: number;
  variancesFound: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'reconciled';
  accuracy: number;
}

export default function CycleCountPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const [cycleCounts, setCycleCounts] = useState<CycleCount[]>([
    {
      id: 1,
      countNumber: 'CC-2025-001',
      warehouse: 'Main Warehouse',
      zone: 'Zone A - Raw Materials',
      countType: 'ABC',
      scheduledDate: '2025-01-22',
      assignedTo: 'John Smith',
      itemsToCount: 145,
      itemsCounted: 145,
      variancesFound: 8,
      status: 'completed',
      accuracy: 94.5
    },
    {
      id: 2,
      countNumber: 'CC-2025-002',
      warehouse: 'Main Warehouse',
      zone: 'Zone B - Components',
      countType: 'Random',
      scheduledDate: '2025-01-21',
      assignedTo: 'Sarah Johnson',
      itemsToCount: 50,
      itemsCounted: 38,
      variancesFound: 3,
      status: 'in-progress',
      accuracy: 92.1
    },
    {
      id: 3,
      countNumber: 'CC-2025-003',
      warehouse: 'FG Store',
      zone: 'Zone A - Finished Goods',
      countType: 'Full',
      scheduledDate: '2025-01-23',
      assignedTo: 'Mike Davis',
      itemsToCount: 230,
      itemsCounted: 0,
      variancesFound: 0,
      status: 'scheduled',
      accuracy: 0
    },
    {
      id: 4,
      countNumber: 'CC-2025-004',
      warehouse: 'Assembly Plant',
      zone: 'Zone C - High Value Items',
      countType: 'ABC',
      scheduledDate: '2025-01-20',
      assignedTo: 'Emily Chen',
      itemsToCount: 89,
      itemsCounted: 89,
      variancesFound: 12,
      status: 'reconciled',
      accuracy: 86.5
    },
    {
      id: 5,
      countNumber: 'CC-2025-005',
      warehouse: 'Main Warehouse',
      zone: 'Zone D - Consumables',
      countType: 'Spot',
      scheduledDate: '2025-01-21',
      assignedTo: 'Robert Lee',
      itemsToCount: 25,
      itemsCounted: 25,
      variancesFound: 2,
      status: 'completed',
      accuracy: 92.0
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'reconciled':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'reconciled':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ABC':
        return 'bg-purple-100 text-purple-800';
      case 'Random':
        return 'bg-blue-100 text-blue-800';
      case 'Full':
        return 'bg-orange-100 text-orange-800';
      case 'Spot':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const scheduledCount = cycleCounts.filter(c => c.status === 'scheduled').length;
  const inProgressCount = cycleCounts.filter(c => c.status === 'in-progress').length;
  const completedCount = cycleCounts.filter(c => c.status === 'completed').length;
  const totalVariances = cycleCounts.reduce((sum, c) => sum + c.variancesFound, 0);
  const avgAccuracy = cycleCounts.filter(c => c.accuracy > 0).reduce((sum, c) => sum + c.accuracy, 0) / 
                       cycleCounts.filter(c => c.accuracy > 0).length;

  const filteredCounts = cycleCounts.filter(count => {
    const matchesSearch = count.countNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         count.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         count.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || count.status === selectedStatus;
    const matchesType = selectedType === 'all' || count.countType === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <span>Cycle Count Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage and track inventory cycle counting activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Schedule Count</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{scheduledCount}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Scheduled</div>
          <div className="text-xs text-blue-600 mt-1">Upcoming Counts</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-900">{inProgressCount}</span>
          </div>
          <div className="text-sm font-medium text-yellow-700">In Progress</div>
          <div className="text-xs text-yellow-600 mt-1">Active Counts</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{completedCount}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Completed</div>
          <div className="text-xs text-green-600 mt-1">This Month</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">{totalVariances}</span>
          </div>
          <div className="text-sm font-medium text-red-700">Total Variances</div>
          <div className="text-xs text-red-600 mt-1">Needs Review</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{avgAccuracy.toFixed(1)}%</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Avg Accuracy</div>
          <div className="text-xs text-purple-600 mt-1">Overall Performance</div>
        </div>
      </div>

      {/* Count Type Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Count Type Distribution</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">
              {cycleCounts.filter(c => c.countType === 'ABC').length}
            </div>
            <div className="text-sm text-purple-700 font-medium mt-1">ABC Analysis</div>
            <div className="text-xs text-purple-600 mt-1">High-value items</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">
              {cycleCounts.filter(c => c.countType === 'Random').length}
            </div>
            <div className="text-sm text-blue-700 font-medium mt-1">Random Sample</div>
            <div className="text-xs text-blue-600 mt-1">Statistical sampling</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-900">
              {cycleCounts.filter(c => c.countType === 'Full').length}
            </div>
            <div className="text-sm text-orange-700 font-medium mt-1">Full Count</div>
            <div className="text-xs text-orange-600 mt-1">Complete inventory</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">
              {cycleCounts.filter(c => c.countType === 'Spot').length}
            </div>
            <div className="text-sm text-green-700 font-medium mt-1">Spot Check</div>
            <div className="text-xs text-green-600 mt-1">Ad-hoc verification</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search counts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="reconciled">Reconciled</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="ABC">ABC Analysis</option>
            <option value="Random">Random Sample</option>
            <option value="Full">Full Count</option>
            <option value="Spot">Spot Check</option>
          </select>
        </div>
      </div>

      {/* Cycle Counts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse / Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCounts.map((count) => (
                <tr key={count.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {count.countNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{count.warehouse}</div>
                    <div className="text-xs text-gray-500">{count.zone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(count.countType)}`}>
                      {count.countType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {count.scheduledDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{count.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count.itemsCounted / count.itemsToCount) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {count.itemsCounted}/{count.itemsToCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {count.variancesFound > 0 ? (
                      <span className="text-sm font-semibold text-red-600">
                        {count.variancesFound}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {count.accuracy > 0 ? (
                      <span className={`text-sm font-semibold ${count.accuracy >= 95 ? 'text-green-600' : count.accuracy >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {count.accuracy.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 w-fit ${getStatusColor(count.status)}`}>
                      {getStatusIcon(count.status)}
                      <span className="capitalize">{count.status.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCounts.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No cycle counts found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
