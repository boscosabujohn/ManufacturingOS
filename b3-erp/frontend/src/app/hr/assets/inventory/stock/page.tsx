'use client';

import { useState, useMemo } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';

interface StockItem {
  id: string;
  assetCode: string;
  assetName: string;
  category: 'laptop' | 'desktop' | 'mobile' | 'monitor' | 'furniture' | 'accessories' | 'other';
  brand: string;
  model: string;
  totalQuantity: number;
  allocated: number;
  available: number;
  minStockLevel: number;
  reorderLevel: number;
  unitCost: number;
  totalValue: number;
  location: string;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'reorder';
}

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockStock: StockItem[] = [
    {
      id: '1',
      assetCode: 'LAP-DEL-5420',
      assetName: 'Dell Latitude 5420',
      category: 'laptop',
      brand: 'Dell',
      model: 'Latitude 5420',
      totalQuantity: 50,
      allocated: 35,
      available: 15,
      minStockLevel: 10,
      reorderLevel: 15,
      unitCost: 65000,
      totalValue: 3250000,
      location: 'Central Warehouse',
      supplier: 'Dell India',
      status: 'in_stock'
    },
    {
      id: '2',
      assetCode: 'MON-DEL-24',
      assetName: 'Dell 24" Monitor',
      category: 'monitor',
      brand: 'Dell',
      model: 'P2422H',
      totalQuantity: 80,
      allocated: 65,
      available: 15,
      minStockLevel: 20,
      reorderLevel: 25,
      unitCost: 12000,
      totalValue: 960000,
      location: 'Central Warehouse',
      supplier: 'Dell India',
      status: 'low_stock'
    },
    {
      id: '3',
      assetCode: 'MOB-SAM-S21',
      assetName: 'Samsung Galaxy S21',
      category: 'mobile',
      brand: 'Samsung',
      model: 'Galaxy S21',
      totalQuantity: 30,
      allocated: 28,
      available: 2,
      minStockLevel: 5,
      reorderLevel: 8,
      unitCost: 45000,
      totalValue: 1350000,
      location: 'IT Store',
      supplier: 'Samsung India',
      status: 'reorder'
    },
    {
      id: '4',
      assetCode: 'DESK-HP-800',
      assetName: 'HP Elite 800 Desktop',
      category: 'desktop',
      brand: 'HP',
      model: 'Elite 800 G8',
      totalQuantity: 25,
      allocated: 25,
      available: 0,
      minStockLevel: 5,
      reorderLevel: 10,
      unitCost: 55000,
      totalValue: 1375000,
      location: 'Central Warehouse',
      supplier: 'HP India',
      status: 'out_of_stock'
    },
    {
      id: '5',
      assetCode: 'FURN-CHR-ERG',
      assetName: 'Ergonomic Office Chair',
      category: 'furniture',
      brand: 'Featherlite',
      model: 'Amaze High Back',
      totalQuantity: 100,
      allocated: 75,
      available: 25,
      minStockLevel: 15,
      reorderLevel: 20,
      unitCost: 8500,
      totalValue: 850000,
      location: 'Furniture Warehouse',
      supplier: 'Featherlite',
      status: 'in_stock'
    },
    {
      id: '6',
      assetCode: 'LAP-LEN-T14',
      assetName: 'Lenovo ThinkPad T14',
      category: 'laptop',
      brand: 'Lenovo',
      model: 'ThinkPad T14 Gen 3',
      totalQuantity: 40,
      allocated: 32,
      available: 8,
      minStockLevel: 10,
      reorderLevel: 12,
      unitCost: 72000,
      totalValue: 2880000,
      location: 'Central Warehouse',
      supplier: 'Lenovo India',
      status: 'low_stock'
    }
  ];

  const filteredStock = mockStock.filter(s => {
    const categoryMatch = selectedCategory === 'all' || s.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || s.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const stats = useMemo(() => ({
    totalValue: mockStock.reduce((sum, s) => sum + s.totalValue, 0),
    totalItems: mockStock.reduce((sum, s) => sum + s.totalQuantity, 0),
    available: mockStock.reduce((sum, s) => sum + s.available, 0),
    lowStock: mockStock.filter(s => s.status === 'low_stock' || s.status === 'reorder').length
  }), [mockStock]);

  const statusColors = {
    in_stock: 'bg-green-100 text-green-700',
    low_stock: 'bg-yellow-100 text-yellow-700',
    out_of_stock: 'bg-red-100 text-red-700',
    reorder: 'bg-orange-100 text-orange-700'
  };

  const categoryColors = {
    laptop: 'bg-purple-100 text-purple-700',
    desktop: 'bg-blue-100 text-blue-700',
    mobile: 'bg-green-100 text-green-700',
    monitor: 'bg-orange-100 text-orange-700',
    furniture: 'bg-pink-100 text-pink-700',
    accessories: 'bg-gray-100 text-gray-700',
    other: 'bg-gray-100 text-gray-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
        <p className="text-sm text-gray-600 mt-1">Monitor and manage asset inventory stock levels</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Value</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₹{(stats.totalValue / 100000).toFixed(2)}L</p>
            </div>
            <IndianRupee className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Items</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.totalItems}</p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Available</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.available}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.lowStock}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Categories</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="monitor">Monitor</option>
              <option value="furniture">Furniture</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="reorder">Reorder Required</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Add Stock Item
            </button>
          </div>
        </div>
      </div>

      {/* Stock List */}
      <div className="space-y-4">
        {filteredStock.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.assetName}</h3>
                    <p className="text-sm text-gray-600">Code: {item.assetCode} • {item.brand} {item.model}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${categoryColors[item.category]}`}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>
                    {item.status === 'in_stock' ? 'In Stock' : item.status === 'low_stock' ? 'Low Stock' : item.status === 'out_of_stock' ? 'Out of Stock' : 'Reorder Required'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Value</p>
                <p className="text-2xl font-bold text-blue-600">₹{item.totalValue.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Quantity</p>
                <p className="text-2xl font-bold text-gray-900">{item.totalQuantity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Allocated</p>
                <p className="text-2xl font-bold text-orange-600">{item.allocated}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Available</p>
                <p className="text-2xl font-bold text-green-600">{item.available}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Min Level</p>
                <p className="text-lg font-semibold text-gray-900">{item.minStockLevel}</p>
                <p className="text-xs text-gray-500">Reorder: {item.reorderLevel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Unit Cost</p>
                <p className="text-lg font-semibold text-gray-900">₹{item.unitCost.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Location</p>
                  <p className="text-sm text-gray-700">{item.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Supplier</p>
                  <p className="text-sm text-gray-700">{item.supplier}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 font-medium">Stock Level:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                    <div
                      className={`h-2 rounded-full ${
                        item.available >= item.reorderLevel ? 'bg-green-500' :
                        item.available >= item.minStockLevel ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(item.available / item.totalQuantity) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-900">{Math.round((item.available / item.totalQuantity) * 100)}%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  View Details
                </button>
                {(item.status === 'low_stock' || item.status === 'reorder' || item.status === 'out_of_stock') && (
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm">
                    Create PO
                  </button>
                )}
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  Adjust Stock
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
