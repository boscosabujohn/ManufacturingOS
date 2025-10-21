'use client';

import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Warehouse,
  BarChart3,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface StockItem {
  id: number;
  itemCode: string;
  itemName: string;
  category: string;
  warehouse: string;
  currentStock: number;
  reorderLevel: number;
  maxLevel: number;
  uom: string;
  unitValue: number;
  totalValue: number;
  lastUpdated: string;
  status: 'adequate' | 'low' | 'critical' | 'overstock';
}

export default function StockLevelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: 1,
      itemCode: 'RM-001',
      itemName: 'Mild Steel Plate 10mm',
      category: 'Raw Material',
      warehouse: 'Main Warehouse',
      currentStock: 450,
      reorderLevel: 200,
      maxLevel: 1000,
      uom: 'Kg',
      unitValue: 65,
      totalValue: 29250,
      lastUpdated: '2025-01-20 14:30',
      status: 'adequate'
    },
    {
      id: 2,
      itemCode: 'RM-002',
      itemName: 'Stainless Steel Rod 25mm',
      category: 'Raw Material',
      warehouse: 'Main Warehouse',
      currentStock: 85,
      reorderLevel: 100,
      maxLevel: 500,
      uom: 'Pcs',
      unitValue: 450,
      totalValue: 38250,
      lastUpdated: '2025-01-20 14:15',
      status: 'low'
    },
    {
      id: 3,
      itemCode: 'CP-101',
      itemName: 'Hydraulic Cylinder Assembly',
      category: 'Components',
      warehouse: 'Assembly Plant',
      currentStock: 12,
      reorderLevel: 20,
      maxLevel: 80,
      uom: 'Nos',
      unitValue: 12500,
      totalValue: 150000,
      lastUpdated: '2025-01-20 13:45',
      status: 'critical'
    },
    {
      id: 4,
      itemCode: 'FG-201',
      itemName: 'Motor Housing Complete',
      category: 'Finished Goods',
      warehouse: 'FG Store',
      currentStock: 145,
      reorderLevel: 50,
      maxLevel: 100,
      uom: 'Nos',
      unitValue: 3500,
      totalValue: 507500,
      lastUpdated: '2025-01-20 12:30',
      status: 'overstock'
    },
    {
      id: 5,
      itemCode: 'RM-003',
      itemName: 'Aluminum Sheet 5mm',
      category: 'Raw Material',
      warehouse: 'Main Warehouse',
      currentStock: 320,
      reorderLevel: 150,
      maxLevel: 800,
      uom: 'Kg',
      unitValue: 180,
      totalValue: 57600,
      lastUpdated: '2025-01-20 11:20',
      status: 'adequate'
    },
    {
      id: 6,
      itemCode: 'CP-102',
      itemName: 'Electric Motor 5HP',
      category: 'Components',
      warehouse: 'Assembly Plant',
      currentStock: 8,
      reorderLevel: 15,
      maxLevel: 60,
      uom: 'Nos',
      unitValue: 8500,
      totalValue: 68000,
      lastUpdated: '2025-01-20 10:45',
      status: 'critical'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'adequate':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'overstock':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'adequate':
        return <TrendingUp className="w-4 h-4" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'overstock':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const totalStockValue = stockItems.reduce((sum, item) => sum + item.totalValue, 0);
  const criticalItems = stockItems.filter(item => item.status === 'critical').length;
  const lowStockItems = stockItems.filter(item => item.status === 'low').length;
  const overstockItems = stockItems.filter(item => item.status === 'overstock').length;

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = selectedWarehouse === 'all' || item.warehouse === selectedWarehouse;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesWarehouse && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span>Stock Levels</span>
          </h1>
          <p className="text-gray-600 mt-1">Real-time inventory levels across all warehouses</p>
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
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{stockItems.length}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Total Items</div>
          <div className="text-xs text-blue-600 mt-1">In Stock</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">₹{(totalStockValue / 100000).toFixed(1)}L</span>
          </div>
          <div className="text-sm font-medium text-green-700">Total Stock Value</div>
          <div className="text-xs text-green-600 mt-1">Current Valuation</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">{criticalItems + lowStockItems}</span>
          </div>
          <div className="text-sm font-medium text-red-700">Low Stock Alerts</div>
          <div className="text-xs text-red-600 mt-1">{criticalItems} Critical</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{overstockItems}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Overstock Items</div>
          <div className="text-xs text-orange-600 mt-1">Above Max Level</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items..."
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
            <option value="Main Warehouse">Main Warehouse</option>
            <option value="Assembly Plant">Assembly Plant</option>
            <option value="FG Store">FG Store</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Raw Material">Raw Material</option>
            <option value="Components">Components</option>
            <option value="Finished Goods">Finished Goods</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="adequate">Adequate</option>
            <option value="low">Low Stock</option>
            <option value="critical">Critical</option>
            <option value="overstock">Overstock</option>
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Warehouse className="w-4 h-4 text-gray-400" />
                      <span>{item.warehouse}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{item.currentStock} {item.uom}</div>
                    <div className="text-xs text-gray-500">Updated: {item.lastUpdated.split(' ')[1]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.reorderLevel} {item.uom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.maxLevel} {item.uom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₹{item.totalValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 w-fit ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="capitalize">{item.status}</span>
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No stock items found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
