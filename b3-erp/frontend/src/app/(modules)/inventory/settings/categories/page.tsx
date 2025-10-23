'use client';

import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Package
} from 'lucide-react';

interface Category {
  id: number;
  code: string;
  name: string;
  parentCategory?: string;
  description: string;
  itemCount: number;
  status: 'active' | 'inactive';
  createdDate: string;
  lastModified: string;
}

export default function InventoryCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('active');

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      code: 'RM',
      name: 'Raw Materials',
      description: 'Primary materials used in manufacturing',
      itemCount: 245,
      status: 'active',
      createdDate: '2024-01-15',
      lastModified: '2025-01-10'
    },
    {
      id: 2,
      code: 'RM-STL',
      name: 'Steel & Metals',
      parentCategory: 'Raw Materials',
      description: 'Steel plates, rods, and metal components',
      itemCount: 85,
      status: 'active',
      createdDate: '2024-01-15',
      lastModified: '2025-01-08'
    },
    {
      id: 3,
      code: 'COMP',
      name: 'Components',
      description: 'Purchased components and parts',
      itemCount: 320,
      status: 'active',
      createdDate: '2024-01-15',
      lastModified: '2025-01-12'
    },
    {
      id: 4,
      code: 'COMP-HYD',
      name: 'Hydraulic Components',
      parentCategory: 'Components',
      description: 'Hydraulic pumps, cylinders, valves',
      itemCount: 95,
      status: 'active',
      createdDate: '2024-01-15',
      lastModified: '2025-01-15'
    },
    {
      id: 5,
      code: 'COMP-ELC',
      name: 'Electrical Components',
      parentCategory: 'Components',
      description: 'Motors, sensors, control panels',
      itemCount: 125,
      status: 'active',
      createdDate: '2024-01-15',
      lastModified: '2025-01-18'
    },
    {
      id: 6,
      code: 'SA',
      name: 'Sub-Assemblies',
      description: 'Manufactured sub-assemblies',
      itemCount: 68,
      status: 'active',
      createdDate: '2024-01-15',
      lastModified: '2025-01-20'
    },
    {
      id: 7,
      code: 'FG',
      name: 'Finished Goods',
      description: 'Completed products ready for sale',
      itemCount: 42,
      status: 'active',
      createdDate: '2024-01-15',
      lastModified: '2025-01-22'
    },
    {
      id: 8,
      code: 'SPR',
      name: 'Spare Parts',
      description: 'After-sales spare parts inventory',
      itemCount: 180,
      status: 'active',
      createdDate: '2024-01-15',
      lastModified: '2025-01-19'
    },
    {
      id: 9,
      code: 'CONS',
      name: 'Consumables',
      description: 'Consumable materials (welding, oils, etc.)',
      itemCount: 95,
      status: 'active',
      createdDate: '2024-01-15',
      lastModified: '2025-01-16'
    },
    {
      id: 10,
      code: 'TOOL',
      name: 'Tools & Equipment',
      description: 'Workshop tools and equipment',
      itemCount: 52,
      status: 'inactive',
      createdDate: '2024-01-15',
      lastModified: '2024-10-05'
    }
  ]);

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const activeCategories = categories.filter(c => c.status === 'active').length;
  const totalItems = categories.reduce((sum, c) => sum + c.itemCount, 0);
  const parentCategories = categories.filter(c => !c.parentCategory).length;

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || category.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FolderTree className="w-8 h-8 text-purple-600" />
            <span>Inventory Categories</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage inventory classification hierarchy</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <FolderTree className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{activeCategories}</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Active Categories</div>
          <div className="text-xs text-purple-600 mt-1">Currently in Use</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{totalItems}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Total Items</div>
          <div className="text-xs text-blue-600 mt-1">Across All Categories</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <FolderTree className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{parentCategories}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Parent Categories</div>
          <div className="text-xs text-green-600 mt-1">Top Level</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search categories..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.code}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {category.parentCategory || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{category.itemCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(category.status)}`}>
                      {category.status.toUpperCase()}
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
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">Delete</span>
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
}
