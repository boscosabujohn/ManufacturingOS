'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  ShoppingCart,
} from 'lucide-react';

interface Material {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  requiredQuantity: number;
  unit: string;
  availableStock: number;
  requiredDate: string;
  status: 'Available' | 'Partial' | 'Out of Stock' | 'Ordered';
  supplier: string;
  unitCost: number;
  totalCost: number;
  leadTime: number;
  projectPhase: string;
}

const mockMaterials: Material[] = [
  {
    id: '1',
    itemCode: 'STOVE-COM-001',
    itemName: 'Commercial Gas Range - 6 Burner',
    category: 'Cooking Equipment',
    requiredQuantity: 4,
    unit: 'Units',
    availableStock: 4,
    requiredDate: '2024-03-06',
    status: 'Available',
    supplier: 'Kitchen Pro India',
    unitCost: 185000,
    totalCost: 740000,
    leadTime: 0,
    projectPhase: 'Equipment Installation',
  },
  {
    id: '2',
    itemCode: 'REF-WALK-002',
    itemName: 'Walk-in Refrigerator - 10x8 ft',
    category: 'Refrigeration',
    requiredQuantity: 2,
    unit: 'Units',
    availableStock: 2,
    requiredDate: '2024-03-10',
    status: 'Available',
    supplier: 'Cold Tech Solutions',
    unitCost: 450000,
    totalCost: 900000,
    leadTime: 0,
    projectPhase: 'Equipment Installation',
  },
  {
    id: '3',
    itemCode: 'EXHS-IND-003',
    itemName: 'Industrial Exhaust Hood - 12 ft',
    category: 'HVAC',
    requiredQuantity: 3,
    unit: 'Units',
    availableStock: 1,
    requiredDate: '2024-03-15',
    status: 'Partial',
    supplier: 'Ventilation Systems Ltd',
    unitCost: 125000,
    totalCost: 375000,
    leadTime: 10,
    projectPhase: 'Equipment Installation',
  },
  {
    id: '4',
    itemCode: 'TILE-NSLP-004',
    itemName: 'Non-Slip Floor Tiles',
    category: 'Building Materials',
    requiredQuantity: 500,
    unit: 'Sq Ft',
    availableStock: 0,
    requiredDate: '2024-02-15',
    status: 'Ordered',
    supplier: 'Tile World',
    unitCost: 450,
    totalCost: 225000,
    leadTime: 5,
    projectPhase: 'Civil Work',
  },
  {
    id: '5',
    itemCode: 'PIPE-SS-005',
    itemName: 'Stainless Steel Pipes - 2 inch',
    category: 'Plumbing',
    requiredQuantity: 200,
    unit: 'Feet',
    availableStock: 0,
    requiredDate: '2024-02-23',
    status: 'Out of Stock',
    supplier: 'Steel Mart India',
    unitCost: 250,
    totalCost: 50000,
    leadTime: 7,
    projectPhase: 'Civil Work',
  },
  {
    id: '6',
    itemCode: 'OVEN-CONV-006',
    itemName: 'Commercial Convection Oven',
    category: 'Cooking Equipment',
    requiredQuantity: 2,
    unit: 'Units',
    availableStock: 2,
    requiredDate: '2024-03-08',
    status: 'Available',
    supplier: 'Kitchen Pro India',
    unitCost: 275000,
    totalCost: 550000,
    leadTime: 0,
    projectPhase: 'Equipment Installation',
  },
  {
    id: '7',
    itemCode: 'FRYER-DEEP-007',
    itemName: 'Deep Fryer - Double Basket',
    category: 'Cooking Equipment',
    requiredQuantity: 3,
    unit: 'Units',
    availableStock: 3,
    requiredDate: '2024-03-10',
    status: 'Available',
    supplier: 'Kitchen Pro India',
    unitCost: 95000,
    totalCost: 285000,
    leadTime: 0,
    projectPhase: 'Equipment Installation',
  },
  {
    id: '8',
    itemCode: 'DRAIN-FLOOR-008',
    itemName: 'Floor Drain System',
    category: 'Plumbing',
    requiredQuantity: 12,
    unit: 'Units',
    availableStock: 0,
    requiredDate: '2024-02-25',
    status: 'Out of Stock',
    supplier: 'Plumbing Pro',
    unitCost: 8500,
    totalCost: 102000,
    leadTime: 5,
    projectPhase: 'Civil Work',
  },
  {
    id: '9',
    itemCode: 'WIRE-ELEC-009',
    itemName: 'Electrical Wiring - 3 Phase',
    category: 'Electrical',
    requiredQuantity: 500,
    unit: 'Meters',
    availableStock: 200,
    requiredDate: '2024-02-28',
    status: 'Partial',
    supplier: 'Electrical Supplies Co',
    unitCost: 150,
    totalCost: 75000,
    leadTime: 3,
    projectPhase: 'Civil Work',
  },
  {
    id: '10',
    itemCode: 'WASH-SINK-010',
    itemName: 'Commercial Wash Sink - Triple Bowl',
    category: 'Plumbing Fixtures',
    requiredQuantity: 2,
    unit: 'Units',
    availableStock: 2,
    requiredDate: '2024-03-12',
    status: 'Available',
    supplier: 'Kitchen Fixtures Ltd',
    unitCost: 65000,
    totalCost: 130000,
    leadTime: 0,
    projectPhase: 'Equipment Installation',
  },
];

export default function MRPPage() {
  const [materials] = useState<Material[]>(mockMaterials);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Statistics
  const stats = {
    total: materials.length,
    available: materials.filter(m => m.status === 'Available').length,
    partial: materials.filter(m => m.status === 'Partial').length,
    outOfStock: materials.filter(m => m.status === 'Out of Stock').length,
    ordered: materials.filter(m => m.status === 'Ordered').length,
    totalCost: materials.reduce((sum, m) => sum + m.totalCost, 0),
  };

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesSearch =
      material.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || material.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || material.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(materials.map(m => m.category)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Partial': return 'bg-yellow-100 text-yellow-700';
      case 'Out of Stock': return 'bg-red-100 text-red-700';
      case 'Ordered': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available': return <CheckCircle className="w-4 h-4" />;
      case 'Partial': return <AlertTriangle className="w-4 h-4" />;
      case 'Out of Stock': return <AlertTriangle className="w-4 h-4" />;
      case 'Ordered': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Material Requirements Planning (MRP)</h1>
          <p className="text-gray-600 mt-1">Track material requirements and procurement status</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5" />
            Export MRP
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Add Material
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Items</p>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Available</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.available}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Partial</p>
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-900">{stats.partial}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Out of Stock</p>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.outOfStock}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Ordered</p>
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.ordered}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Cost</p>
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-purple-900">{formatCurrency(stats.totalCost)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Partial">Partial</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Ordered">Ordered</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{material.itemName}</p>
                      <p className="text-sm text-gray-500">{material.itemCode}</p>
                      <p className="text-xs text-gray-400 mt-1">{material.projectPhase}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {material.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {material.requiredQuantity} {material.unit}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium ${
                      material.availableStock >= material.requiredQuantity ? 'text-green-900' :
                      material.availableStock > 0 ? 'text-yellow-900' :
                      'text-red-900'
                    }`}>
                      {material.availableStock} {material.unit}
                    </p>
                    {material.availableStock < material.requiredQuantity && (
                      <p className="text-xs text-red-600 mt-1">
                        Short by {material.requiredQuantity - material.availableStock}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(material.status)}`}>
                      {getStatusIcon(material.status)}
                      {material.status}
                    </span>
                    {material.leadTime > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Lead: {material.leadTime} days
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{formatDate(material.requiredDate)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{material.supplier}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(material.totalCost)}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(material.unitCost)}/unit</p>
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
