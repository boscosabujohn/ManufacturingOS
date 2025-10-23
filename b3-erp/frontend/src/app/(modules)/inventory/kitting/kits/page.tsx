'use client';

import React, { useState } from 'react';
import {
  Package,
  Boxes,
  Calendar,
  User,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Plus,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface Kit {
  id: number;
  kitNumber: string;
  kitName: string;
  category: string;
  componentCount: number;
  outputQuantity: number;
  outputUOM: string;
  status: 'active' | 'inactive' | 'draft';
  lastAssembled?: string;
  assemblyCount: number;
  createdBy: string;
  createdDate: string;
}

export default function KitsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active');

  const [kits, setKits] = useState<Kit[]>([
    {
      id: 1,
      kitNumber: 'KIT-001',
      kitName: 'Hydraulic System Assembly Kit',
      category: 'Sub-Assembly',
      componentCount: 12,
      outputQuantity: 1,
      outputUOM: 'SET',
      status: 'active',
      lastAssembled: '2025-01-20',
      assemblyCount: 45,
      createdBy: 'John Smith',
      createdDate: '2024-06-15'
    },
    {
      id: 2,
      kitNumber: 'KIT-002',
      kitName: 'Control Panel Electronics Kit',
      category: 'Electronics',
      componentCount: 18,
      outputQuantity: 1,
      outputUOM: 'UNIT',
      status: 'active',
      lastAssembled: '2025-01-22',
      assemblyCount: 68,
      createdBy: 'Sarah Johnson',
      createdDate: '2024-07-20'
    },
    {
      id: 3,
      kitNumber: 'KIT-003',
      kitName: 'Excavator Maintenance Kit',
      category: 'Maintenance',
      componentCount: 8,
      outputQuantity: 1,
      outputUOM: 'KIT',
      status: 'active',
      lastAssembled: '2025-01-18',
      assemblyCount: 32,
      createdBy: 'Mike Davis',
      createdDate: '2024-08-10'
    },
    {
      id: 4,
      kitNumber: 'KIT-004',
      kitName: 'Welding Consumables Pack',
      category: 'Consumables',
      componentCount: 6,
      outputQuantity: 10,
      outputUOM: 'PACK',
      status: 'active',
      lastAssembled: '2025-01-21',
      assemblyCount: 120,
      createdBy: 'Emily Chen',
      createdDate: '2024-05-05'
    },
    {
      id: 5,
      kitNumber: 'KIT-005',
      kitName: 'Bearing & Seal Replacement Kit',
      category: 'Spares',
      componentCount: 15,
      outputQuantity: 1,
      outputUOM: 'SET',
      status: 'active',
      lastAssembled: '2025-01-19',
      assemblyCount: 28,
      createdBy: 'Robert Lee',
      createdDate: '2024-09-12'
    },
    {
      id: 6,
      kitNumber: 'KIT-006',
      kitName: 'Safety Equipment Bundle',
      category: 'Safety',
      componentCount: 10,
      outputQuantity: 1,
      outputUOM: 'SET',
      status: 'active',
      lastAssembled: '2025-01-17',
      assemblyCount: 52,
      createdBy: 'John Smith',
      createdDate: '2024-04-18'
    },
    {
      id: 7,
      kitNumber: 'KIT-007',
      kitName: 'Old Prototype Kit v1',
      category: 'Prototype',
      componentCount: 20,
      outputQuantity: 1,
      outputUOM: 'UNIT',
      status: 'inactive',
      assemblyCount: 5,
      createdBy: 'Sarah Johnson',
      createdDate: '2023-11-22'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'draft':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Sub-Assembly': 'text-blue-600 bg-blue-50 border-blue-200',
      'Electronics': 'text-purple-600 bg-purple-50 border-purple-200',
      'Maintenance': 'text-orange-600 bg-orange-50 border-orange-200',
      'Consumables': 'text-green-600 bg-green-50 border-green-200',
      'Spares': 'text-cyan-600 bg-cyan-50 border-cyan-200',
      'Safety': 'text-red-600 bg-red-50 border-red-200',
      'Prototype': 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[category] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const totalKits = kits.filter(k => k.status === 'active').length;
  const totalAssemblies = kits.reduce((sum, k) => sum + k.assemblyCount, 0);
  const avgComponents = Math.round(kits.reduce((sum, k) => sum + k.componentCount, 0) / kits.length);
  const mostUsedKit = kits.reduce((max, k) => k.assemblyCount > max.assemblyCount ? k : max, kits[0]);

  const filteredKits = kits.filter(kit => {
    const matchesSearch = kit.kitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         kit.kitName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || kit.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || kit.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Boxes className="w-8 h-8 text-blue-600" />
            <span>Kitting - Kit Definitions</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage kit definitions and component lists</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Kit</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Boxes className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{totalKits}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Active Kits</div>
          <div className="text-xs text-blue-600 mt-1">Total Definitions</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{totalAssemblies}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Total Assemblies</div>
          <div className="text-xs text-green-600 mt-1">All Time</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{avgComponents}</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Avg Components</div>
          <div className="text-xs text-purple-600 mt-1">Per Kit</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{mostUsedKit.assemblyCount}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Most Used Kit</div>
          <div className="text-xs text-orange-600 mt-1 truncate">{mostUsedKit.kitName}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search kits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Sub-Assembly">Sub-Assembly</option>
            <option value="Electronics">Electronics</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Consumables">Consumables</option>
            <option value="Spares">Spares</option>
            <option value="Safety">Safety</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Kits Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kit Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kit Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Components</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assembly Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Assembled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKits.map((kit) => (
                <tr key={kit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {kit.kitNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{kit.kitName}</div>
                    <div className="text-xs text-gray-500">
                      Created by {kit.createdBy} on {kit.createdDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(kit.category)}`}>
                      {kit.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{kit.componentCount} items</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{kit.outputQuantity} {kit.outputUOM}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{kit.assemblyCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {kit.lastAssembled ? (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{kit.lastAssembled}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Never</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(kit.status)}`}>
                      {kit.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredKits.length === 0 && (
          <div className="text-center py-12">
            <Boxes className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No kits found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
