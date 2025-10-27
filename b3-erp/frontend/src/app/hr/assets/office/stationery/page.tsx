'use client';

import { useState, useMemo } from 'react';
import { Pen, Package, AlertTriangle } from 'lucide-react';

interface StationeryItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: 'writing' | 'paper' | 'filing' | 'desk' | 'binding' | 'other';
  brand: string;
  unit: 'pcs' | 'box' | 'pack' | 'ream' | 'set';
  totalQuantity: number;
  issued: number;
  available: number;
  minStockLevel: number;
  reorderLevel: number;
  unitCost: number;
  totalValue: number;
  location: string;
  supplier: string;
  lastPurchaseDate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'reorder';
}

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockStationery: StationeryItem[] = [
    {
      id: '1',
      itemCode: 'ST-PEN-001',
      itemName: 'Ball Point Pen - Blue',
      category: 'writing',
      brand: 'Cello',
      unit: 'box',
      totalQuantity: 50,
      issued: 32,
      available: 18,
      minStockLevel: 10,
      reorderLevel: 15,
      unitCost: 120,
      totalValue: 6000,
      location: 'Mumbai Office - Storage Room',
      supplier: 'Office Mart India',
      lastPurchaseDate: '2024-09-15',
      status: 'in_stock'
    },
    {
      id: '2',
      itemCode: 'ST-PAP-001',
      itemName: 'A4 Copier Paper',
      category: 'paper',
      brand: 'JK Paper',
      unit: 'ream',
      totalQuantity: 100,
      issued: 78,
      available: 22,
      minStockLevel: 20,
      reorderLevel: 30,
      unitCost: 250,
      totalValue: 25000,
      location: 'Mumbai Office - Storage Room',
      supplier: 'JK Paper Distributors',
      lastPurchaseDate: '2024-10-01',
      status: 'low_stock'
    },
    {
      id: '3',
      itemCode: 'ST-FIL-012',
      itemName: 'Ring Binder File',
      category: 'filing',
      brand: 'Faber-Castell',
      unit: 'pcs',
      totalQuantity: 25,
      issued: 25,
      available: 0,
      minStockLevel: 10,
      reorderLevel: 15,
      unitCost: 85,
      totalValue: 2125,
      location: 'Delhi Office - Storage',
      supplier: 'Office Mart India',
      lastPurchaseDate: '2024-08-20',
      status: 'out_of_stock'
    },
    {
      id: '4',
      itemCode: 'ST-DSK-005',
      itemName: 'Stapler - Heavy Duty',
      category: 'desk',
      brand: 'Kangaro',
      unit: 'pcs',
      totalQuantity: 30,
      issued: 18,
      available: 12,
      minStockLevel: 8,
      reorderLevel: 10,
      unitCost: 450,
      totalValue: 13500,
      location: 'Bangalore Office - Storage',
      supplier: 'Stationary World',
      lastPurchaseDate: '2024-07-10',
      status: 'reorder'
    },
    {
      id: '5',
      itemCode: 'ST-WRT-015',
      itemName: 'Whiteboard Marker',
      category: 'writing',
      brand: 'Camlin',
      unit: 'box',
      totalQuantity: 40,
      issued: 25,
      available: 15,
      minStockLevel: 10,
      reorderLevel: 15,
      unitCost: 180,
      totalValue: 7200,
      location: 'Pune Office - Storage',
      supplier: 'Office Mart India',
      lastPurchaseDate: '2024-09-25',
      status: 'in_stock'
    },
    {
      id: '6',
      itemCode: 'ST-BND-008',
      itemName: 'Spiral Binding Coils',
      category: 'binding',
      brand: 'Fellowes',
      unit: 'pack',
      totalQuantity: 15,
      issued: 12,
      available: 3,
      minStockLevel: 5,
      reorderLevel: 8,
      unitCost: 650,
      totalValue: 9750,
      location: 'Hyderabad Office - Storage',
      supplier: 'Binding Solutions India',
      lastPurchaseDate: '2024-08-05',
      status: 'low_stock'
    }
  ];

  const filteredStationery = mockStationery.filter(s => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && s.status !== selectedStatus) return false;
    return true;
  });

  const stats = useMemo(() => ({
    totalItems: mockStationery.reduce((sum, s) => sum + s.totalQuantity, 0),
    available: mockStationery.reduce((sum, s) => sum + s.available, 0),
    lowStock: mockStationery.filter(s => s.status === 'low_stock' || s.status === 'reorder').length,
    outOfStock: mockStationery.filter(s => s.status === 'out_of_stock').length,
    totalValue: mockStationery.reduce((sum, s) => sum + s.totalValue, 0)
  }), [mockStationery]);

  const statusColors = {
    in_stock: 'bg-green-100 text-green-700',
    low_stock: 'bg-yellow-100 text-yellow-700',
    out_of_stock: 'bg-red-100 text-red-700',
    reorder: 'bg-orange-100 text-orange-700'
  };

  const categoryColors = {
    writing: 'bg-blue-100 text-blue-700',
    paper: 'bg-green-100 text-green-700',
    filing: 'bg-purple-100 text-purple-700',
    desk: 'bg-orange-100 text-orange-700',
    binding: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700'
  };

  const categoryLabel = {
    writing: 'Writing',
    paper: 'Paper',
    filing: 'Filing',
    desk: 'Desk Accessories',
    binding: 'Binding',
    other: 'Other'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stationery Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage office stationery inventory and stock levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Items</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalItems}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Available</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.available}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-600">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.lowStock}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm font-medium text-red-600">Out of Stock</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.outOfStock}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm font-medium text-purple-600">Total Value</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">₹{stats.totalValue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Categories</option>
              <option value="writing">Writing</option>
              <option value="paper">Paper</option>
              <option value="filing">Filing</option>
              <option value="desk">Desk Accessories</option>
              <option value="binding">Binding</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="reorder">Reorder</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Add Item
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredStationery.map(item => {
          const stockPercent = (item.available / item.totalQuantity) * 100;

          return (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <Pen className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.itemName}</h3>
                      <p className="text-sm text-gray-600">Code: {item.itemCode} • {item.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${categoryColors[item.category]}`}>
                      {categoryLabel[item.category]}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>
                      {item.status === 'in_stock' ? 'In Stock' : item.status === 'low_stock' ? 'Low Stock' : item.status === 'out_of_stock' ? 'Out of Stock' : 'Reorder'}
                    </span>
                    {(item.status === 'low_stock' || item.status === 'reorder' || item.status === 'out_of_stock') && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-red-50 text-red-700 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-blue-600">₹{item.totalValue.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-600 mt-1">₹{item.unitCost}/{item.unit}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Quantity</p>
                  <p className="text-sm font-semibold text-gray-900">{item.totalQuantity} {item.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Issued</p>
                  <p className="text-sm font-semibold text-gray-900">{item.issued} {item.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Available</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <Package className="h-4 w-4 text-green-600" />
                    {item.available} {item.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Reorder Level</p>
                  <p className="text-sm font-semibold text-gray-900">{item.reorderLevel} {item.unit}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 uppercase font-medium">Stock Level</p>
                  <p className="text-xs font-semibold text-gray-900">{item.available} / {item.totalQuantity} ({stockPercent.toFixed(0)}%)</p>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      stockPercent >= 50 ? 'bg-green-500' :
                      stockPercent >= 20 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${stockPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Supplier</p>
                  <p className="text-sm font-semibold text-gray-900">{item.supplier}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{item.location}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Last Purchase</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(item.lastPurchaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  Issue Item
                </button>
                {(item.status === 'low_stock' || item.status === 'reorder' || item.status === 'out_of_stock') && (
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm">
                    Reorder
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  View History
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
