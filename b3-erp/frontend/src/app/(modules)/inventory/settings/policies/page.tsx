'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Eye,
  Search,
  Settings,
  DollarSign,
  Package,
  Calendar
} from 'lucide-react';

interface InventoryPolicy {
  id: number;
  policyCode: string;
  policyName: string;
  policyType: 'reorder' | 'valuation' | 'cycle-count' | 'shelf-life' | 'reservation';
  category: string;
  description: string;
  parameters: {
    reorderPoint?: number;
    reorderQuantity?: number;
    minLevel?: number;
    maxLevel?: number;
    safetyStock?: number;
    leadTimeDays?: number;
    valuationMethod?: 'FIFO' | 'LIFO' | 'Weighted Average' | 'Standard Cost';
    countFrequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
    abcClass?: 'A' | 'B' | 'C';
    shelfLifeDays?: number;
    expiryWarningDays?: number;
    autoReserve?: boolean;
    reservationPriority?: 'FIFO' | 'FEFO' | 'Manual';
  };
  applicableItems: number;
  status: 'active' | 'inactive' | 'draft';
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

export default function InventoryPoliciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [policies, setPolicies] = useState<InventoryPolicy[]>([
    {
      id: 1,
      policyCode: 'POL-REORD-001',
      policyName: 'Standard Reorder Policy - Raw Materials',
      policyType: 'reorder',
      category: 'Raw Materials',
      description: 'Standard reorder rules for raw material inventory',
      parameters: {
        reorderPoint: 100,
        reorderQuantity: 500,
        minLevel: 50,
        maxLevel: 1000,
        safetyStock: 30,
        leadTimeDays: 7
      },
      applicableItems: 145,
      status: 'active',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-01-15',
      lastModified: '2024-10-10'
    },
    {
      id: 2,
      policyCode: 'POL-VAL-001',
      policyName: 'FIFO Valuation - Finished Goods',
      policyType: 'valuation',
      category: 'Finished Goods',
      description: 'First-In-First-Out valuation method for finished goods',
      parameters: {
        valuationMethod: 'FIFO'
      },
      applicableItems: 42,
      status: 'active',
      createdBy: 'Priya Singh',
      createdDate: '2024-02-01',
      lastModified: '2024-08-20'
    },
    {
      id: 3,
      policyCode: 'POL-CC-001',
      policyName: 'ABC Cycle Count - Class A',
      policyType: 'cycle-count',
      category: 'All Categories',
      description: 'High-value items counted weekly',
      parameters: {
        countFrequency: 'Weekly',
        abcClass: 'A'
      },
      applicableItems: 85,
      status: 'active',
      createdBy: 'Amit Patel',
      createdDate: '2024-03-10',
      lastModified: '2024-09-15'
    },
    {
      id: 4,
      policyCode: 'POL-CC-002',
      policyName: 'ABC Cycle Count - Class B',
      policyType: 'cycle-count',
      category: 'All Categories',
      description: 'Medium-value items counted monthly',
      parameters: {
        countFrequency: 'Monthly',
        abcClass: 'B'
      },
      applicableItems: 180,
      status: 'active',
      createdBy: 'Amit Patel',
      createdDate: '2024-03-10',
      lastModified: '2024-09-15'
    },
    {
      id: 5,
      policyCode: 'POL-CC-003',
      policyName: 'ABC Cycle Count - Class C',
      policyType: 'cycle-count',
      category: 'All Categories',
      description: 'Low-value items counted quarterly',
      parameters: {
        countFrequency: 'Quarterly',
        abcClass: 'C'
      },
      applicableItems: 295,
      status: 'active',
      createdBy: 'Amit Patel',
      createdDate: '2024-03-10',
      lastModified: '2024-09-15'
    },
    {
      id: 6,
      policyCode: 'POL-SHELF-001',
      policyName: 'Shelf Life Control - Consumables',
      policyType: 'shelf-life',
      category: 'Consumables',
      description: 'Expiry tracking for consumable items',
      parameters: {
        shelfLifeDays: 365,
        expiryWarningDays: 30
      },
      applicableItems: 68,
      status: 'active',
      createdBy: 'Sunita Desai',
      createdDate: '2024-04-05',
      lastModified: '2024-09-28'
    },
    {
      id: 7,
      policyCode: 'POL-RES-001',
      policyName: 'Auto Reservation - Production Orders',
      policyType: 'reservation',
      category: 'Components',
      description: 'Automatic inventory reservation for production',
      parameters: {
        autoReserve: true,
        reservationPriority: 'FIFO'
      },
      applicableItems: 220,
      status: 'active',
      createdBy: 'Vikram Malhotra',
      createdDate: '2024-05-20',
      lastModified: '2024-10-05'
    },
    {
      id: 8,
      policyCode: 'POL-VAL-002',
      policyName: 'Weighted Average - Components',
      policyType: 'valuation',
      category: 'Components',
      description: 'Weighted average cost valuation for components',
      parameters: {
        valuationMethod: 'Weighted Average'
      },
      applicableItems: 320,
      status: 'active',
      createdBy: 'Priya Singh',
      createdDate: '2024-06-15',
      lastModified: '2024-10-12'
    },
    {
      id: 9,
      policyCode: 'POL-REORD-002',
      policyName: 'Critical Spares Reorder',
      policyType: 'reorder',
      category: 'Spare Parts',
      description: 'High safety stock for critical spare parts',
      parameters: {
        reorderPoint: 20,
        reorderQuantity: 100,
        minLevel: 10,
        maxLevel: 200,
        safetyStock: 15,
        leadTimeDays: 14
      },
      applicableItems: 78,
      status: 'active',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-07-01',
      lastModified: '2024-10-18'
    },
    {
      id: 10,
      policyCode: 'POL-SHELF-002',
      policyName: 'FEFO Reservation - Perishables',
      policyType: 'reservation',
      category: 'Consumables',
      description: 'First-Expiry-First-Out for perishable items',
      parameters: {
        autoReserve: true,
        reservationPriority: 'FEFO'
      },
      applicableItems: 42,
      status: 'draft',
      createdBy: 'Sunita Desai',
      createdDate: '2024-10-15',
      lastModified: '2024-10-20'
    }
  ]);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'reorder': 'text-blue-600 bg-blue-50 border-blue-200',
      'valuation': 'text-green-600 bg-green-50 border-green-200',
      'cycle-count': 'text-purple-600 bg-purple-50 border-purple-200',
      'shelf-life': 'text-orange-600 bg-orange-50 border-orange-200',
      'reservation': 'text-pink-600 bg-pink-50 border-pink-200'
    };
    return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

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

  const activePolicies = policies.filter(p => p.status === 'active').length;
  const totalApplicableItems = policies.filter(p => p.status === 'active').reduce((sum, p) => sum + p.applicableItems, 0);
  
  // Count valuation methods
  const valuationPolicies = policies.filter(p => p.policyType === 'valuation' && p.status === 'active');
  const defaultValuation = valuationPolicies.length > 0 ? valuationPolicies[0].parameters.valuationMethod : 'FIFO';

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         policy.policyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         policy.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || policy.policyType === selectedType;
    const matchesStatus = selectedStatus === 'all' || policy.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const renderPolicyParameters = (policy: InventoryPolicy) => {
    const params = policy.parameters;
    switch (policy.policyType) {
      case 'reorder':
        return (
          <div className="text-xs text-gray-600 space-y-1">
            <div>Reorder Point: {params.reorderPoint} | Qty: {params.reorderQuantity}</div>
            <div>Min/Max: {params.minLevel}/{params.maxLevel} | Safety Stock: {params.safetyStock}</div>
            <div>Lead Time: {params.leadTimeDays} days</div>
          </div>
        );
      case 'valuation':
        return (
          <div className="text-xs text-gray-600">
            Method: <span className="font-medium">{params.valuationMethod}</span>
          </div>
        );
      case 'cycle-count':
        return (
          <div className="text-xs text-gray-600">
            Class {params.abcClass} - {params.countFrequency} Counting
          </div>
        );
      case 'shelf-life':
        return (
          <div className="text-xs text-gray-600">
            Shelf Life: {params.shelfLifeDays} days | Warning: {params.expiryWarningDays} days before expiry
          </div>
        );
      case 'reservation':
        return (
          <div className="text-xs text-gray-600">
            Auto Reserve: {params.autoReserve ? 'Yes' : 'No'} | Priority: {params.reservationPriority}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="w-8 h-8 text-indigo-600" />
            <span>Inventory Policies</span>
          </h1>
          <p className="text-gray-600 mt-1">Configure inventory management policies and business rules</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Policy</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-900">{activePolicies}</span>
          </div>
          <div className="text-sm font-medium text-indigo-700">Active Policies</div>
          <div className="text-xs text-indigo-600 mt-1">In Operation</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{defaultValuation}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Default Valuation</div>
          <div className="text-xs text-green-600 mt-1">Primary Method</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{totalApplicableItems}</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Items Covered</div>
          <div className="text-xs text-purple-600 mt-1">Under Active Policies</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Policy Types</option>
            <option value="reorder">Reorder Policies</option>
            <option value="valuation">Valuation Methods</option>
            <option value="cycle-count">Cycle Count Rules</option>
            <option value="shelf-life">Shelf Life Control</option>
            <option value="reservation">Reservation Rules</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameters</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicable Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{policy.policyCode}</div>
                    <div className="text-sm text-gray-600">{policy.policyName}</div>
                    <div className="text-xs text-gray-500 mt-1">{policy.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(policy.policyType)}`}>
                      {policy.policyType.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.category}
                  </td>
                  <td className="px-6 py-4">
                    {renderPolicyParameters(policy)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{policy.applicableItems}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {policy.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{policy.lastModified}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(policy.status)}`}>
                      {policy.status.toUpperCase()}
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
      </div>

      {/* Policy Type Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Reorder Policies</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Define reorder points, quantities, min/max levels, and safety stock for automated replenishment.
          </p>
          <div className="text-xs text-gray-500">
            <div>• Reorder Point = Lead Time Demand + Safety Stock</div>
            <div>• Reorder Quantity = Economic Order Quantity (EOQ)</div>
            <div>• Safety Stock = Z-score × σ × √Lead Time</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Valuation Methods</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Control how inventory costs are calculated and tracked in financial statements.
          </p>
          <div className="text-xs text-gray-500">
            <div>• FIFO: First-In-First-Out</div>
            <div>• LIFO: Last-In-First-Out</div>
            <div>• Weighted Average: Average cost method</div>
            <div>• Standard Cost: Predetermined costing</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Cycle Count Rules</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            ABC classification-based counting frequency to maintain inventory accuracy.
          </p>
          <div className="text-xs text-gray-500">
            <div>• Class A (High Value): Weekly/Daily counts</div>
            <div>• Class B (Medium Value): Monthly counts</div>
            <div>• Class C (Low Value): Quarterly counts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
