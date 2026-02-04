'use client';

import { useState, useMemo } from 'react';
import { Headphones, Package } from 'lucide-react';

interface AccessoryAsset {
  id: string;
  assetCode: string;
  name: string;
  category: 'keyboard' | 'mouse' | 'headset' | 'webcam' | 'docking_station' | 'other';
  brand: string;
  model: string;
  quantity: number;
  allocated: number;
  available: number;
  unitCost: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockAccessories: AccessoryAsset[] = [
    {
      id: '1',
      assetCode: 'ACC-KB-001',
      name: 'Wireless Keyboard',
      category: 'keyboard',
      brand: 'Logitech',
      model: 'MX Keys',
      quantity: 50,
      allocated: 35,
      available: 15,
      unitCost: 8500,
      location: 'IT Store',
      status: 'in_stock'
    },
    {
      id: '2',
      assetCode: 'ACC-MS-001',
      name: 'Wireless Mouse',
      category: 'mouse',
      brand: 'Logitech',
      model: 'MX Master 3',
      quantity: 60,
      allocated: 45,
      available: 15,
      unitCost: 6500,
      location: 'IT Store',
      status: 'in_stock'
    },
    {
      id: '3',
      assetCode: 'ACC-HS-001',
      name: 'USB Headset',
      category: 'headset',
      brand: 'Jabra',
      model: 'Evolve 40',
      quantity: 30,
      allocated: 25,
      available: 5,
      unitCost: 4500,
      location: 'IT Store',
      status: 'low_stock'
    },
    {
      id: '4',
      assetCode: 'ACC-WC-001',
      name: 'HD Webcam',
      category: 'webcam',
      brand: 'Logitech',
      model: 'C920',
      quantity: 20,
      allocated: 18,
      available: 2,
      unitCost: 5500,
      location: 'IT Store',
      status: 'low_stock'
    },
    {
      id: '5',
      assetCode: 'ACC-DS-001',
      name: 'USB-C Docking Station',
      category: 'docking_station',
      brand: 'Dell',
      model: 'WD19',
      quantity: 15,
      allocated: 15,
      available: 0,
      unitCost: 15000,
      location: 'IT Store',
      status: 'out_of_stock'
    }
  ];

  const filteredAccessories = mockAccessories.filter(a => selectedCategory === 'all' || a.category === selectedCategory);

  const stats = useMemo(() => ({
    totalItems: filteredAccessories.reduce((sum, a) => sum + a.quantity, 0),
    allocated: filteredAccessories.reduce((sum, a) => sum + a.allocated, 0),
    available: filteredAccessories.reduce((sum, a) => sum + a.available, 0),
    lowStock: filteredAccessories.filter(a => a.status === 'low_stock' || a.status === 'out_of_stock').length
  }), [filteredAccessories]);

  const statusColors = {
    in_stock: 'bg-green-100 text-green-700',
    low_stock: 'bg-yellow-100 text-yellow-700',
    out_of_stock: 'bg-red-100 text-red-700'
  };

  const categoryColors = {
    keyboard: 'bg-blue-100 text-blue-700',
    mouse: 'bg-purple-100 text-purple-700',
    headset: 'bg-green-100 text-green-700',
    webcam: 'bg-orange-100 text-orange-700',
    docking_station: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700'
  };

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">IT Accessories</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and track IT accessories inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Items</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalItems}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
          <p className="text-sm font-medium text-orange-600">Allocated</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">{stats.allocated}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <p className="text-sm font-medium text-green-600">Available</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.available}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <p className="text-sm font-medium text-red-600">Low Stock</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.lowStock}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Categories</option>
              <option value="keyboard">Keyboard</option>
              <option value="mouse">Mouse</option>
              <option value="headset">Headset</option>
              <option value="webcam">Webcam</option>
              <option value="docking_station">Docking Station</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Add Accessory
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredAccessories.map(accessory => (
          <div key={accessory.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{accessory.name}</h3>
                    <p className="text-sm text-gray-600">Code: {accessory.assetCode} • {accessory.brand} {accessory.model}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${categoryColors[accessory.category]}`}>
                    {accessory.category.replace('_', ' ').charAt(0).toUpperCase() + accessory.category.replace('_', ' ').slice(1)}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[accessory.status]}`}>
                    {accessory.status === 'in_stock' ? 'In Stock' : accessory.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Unit Cost</p>
                <p className="text-2xl font-bold text-blue-600">₹{accessory.unitCost.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Quantity</p>
                <p className="text-2xl font-bold text-gray-900">{accessory.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Allocated</p>
                <p className="text-2xl font-bold text-orange-600">{accessory.allocated}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Available</p>
                <p className="text-2xl font-bold text-green-600">{accessory.available}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Stock Level:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        accessory.available / accessory.quantity >= 0.3 ? 'bg-green-500' :
                        accessory.available > 0 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(accessory.available / accessory.quantity) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-900">{Math.round((accessory.available / accessory.quantity) * 100)}%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  View Details
                </button>
                {(accessory.status === 'low_stock' || accessory.status === 'out_of_stock') && (
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm">
                    Reorder
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
