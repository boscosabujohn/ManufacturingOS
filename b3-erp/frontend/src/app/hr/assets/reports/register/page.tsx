'use client';

import { useState } from 'react';
import { BookOpen, Calendar, IndianRupee, Tag } from 'lucide-react';

interface AssetRegister {
  assetTag: string;
  assetName: string;
  category: string;
  brand: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  assignedTo?: string;
  department?: string;
  location: string;
  warranty: string;
  status: 'active' | 'retired' | 'maintenance';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockData: AssetRegister[] = [
    {
      assetTag: 'LAP-2024-001',
      assetName: 'Dell Latitude 5420',
      category: 'Laptop',
      brand: 'Dell',
      serialNumber: 'DL5420-2024-001',
      purchaseDate: '2024-01-15',
      purchaseCost: 65000,
      assignedTo: 'Rajesh Kumar (EMP345)',
      department: 'Sales',
      location: 'Mumbai Office',
      warranty: '2027-01-15',
      status: 'active',
      condition: 'excellent'
    },
    {
      assetTag: 'DESK-2024-002',
      assetName: 'HP Elite 800 G8',
      category: 'Desktop',
      brand: 'HP',
      serialNumber: 'HP800-2024-002',
      purchaseDate: '2024-02-10',
      purchaseCost: 55000,
      assignedTo: 'IT Team',
      department: 'IT',
      location: 'Hyderabad Office',
      warranty: '2027-02-10',
      status: 'active',
      condition: 'excellent'
    },
    {
      assetTag: 'MOB-2024-001',
      assetName: 'Samsung Galaxy S21',
      category: 'Mobile',
      brand: 'Samsung',
      serialNumber: 'SGS21-2024-001',
      purchaseDate: '2024-01-20',
      purchaseCost: 45000,
      assignedTo: 'Arjun Kapoor (EMP890)',
      department: 'Sales',
      location: 'Delhi Office',
      warranty: '2025-01-20',
      status: 'active',
      condition: 'good'
    },
    {
      assetTag: 'MON-2024-015',
      assetName: 'Dell P2422H 24"',
      category: 'Monitor',
      brand: 'Dell',
      serialNumber: 'DLP24-2024-015',
      purchaseDate: '2024-03-05',
      purchaseCost: 18000,
      assignedTo: 'Priya Sharma (EMP412)',
      department: 'Marketing',
      location: 'Delhi Office',
      warranty: '2027-03-05',
      status: 'active',
      condition: 'excellent'
    },
    {
      assetTag: 'PRN-2023-045',
      assetName: 'Canon imageRUNNER 2525i',
      category: 'Printer',
      brand: 'Canon',
      serialNumber: 'CIR2525-2023-045',
      purchaseDate: '2023-06-15',
      purchaseCost: 125000,
      department: 'Operations',
      location: 'Bangalore Office',
      warranty: '2026-06-15',
      status: 'maintenance',
      condition: 'fair'
    },
    {
      assetTag: 'FUR-DESK-001',
      assetName: 'Executive Desk',
      category: 'Furniture',
      brand: 'Godrej Interio',
      serialNumber: 'GI-DESK-001',
      purchaseDate: '2024-01-20',
      purchaseCost: 35000,
      assignedTo: 'Rajesh Kumar (EMP345)',
      department: 'Sales',
      location: 'Mumbai Office - 3rd Floor',
      warranty: 'N/A',
      status: 'active',
      condition: 'excellent'
    },
    {
      assetTag: 'SRV-2023-012',
      assetName: 'Lenovo ThinkSystem SR650',
      category: 'Server',
      brand: 'Lenovo',
      serialNumber: 'LSR650-2023-012',
      purchaseDate: '2023-01-15',
      purchaseCost: 450000,
      department: 'IT',
      location: 'Mumbai Data Center',
      warranty: '2028-01-15',
      status: 'active',
      condition: 'good'
    },
    {
      assetTag: 'LAP-2020-089',
      assetName: 'Dell Latitude 7400',
      category: 'Laptop',
      brand: 'Dell',
      serialNumber: 'DL7400-2020-089',
      purchaseDate: '2020-05-10',
      purchaseCost: 85000,
      location: 'Storage - Mumbai',
      warranty: '2023-05-10',
      status: 'retired',
      condition: 'poor'
    }
  ];

  const filteredData = mockData.filter(asset => {
    if (selectedCategory !== 'all' && asset.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && asset.status !== selectedStatus) return false;
    return true;
  });

  const stats = {
    totalAssets: mockData.length,
    totalValue: mockData.reduce((sum, asset) => sum + asset.purchaseCost, 0),
    active: mockData.filter(a => a.status === 'active').length,
    maintenance: mockData.filter(a => a.status === 'maintenance').length,
    retired: mockData.filter(a => a.status === 'retired').length
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    maintenance: 'bg-orange-100 text-orange-700',
    retired: 'bg-gray-100 text-gray-700'
  };

  const conditionColors = {
    excellent: 'bg-green-100 text-green-700',
    good: 'bg-blue-100 text-blue-700',
    fair: 'bg-yellow-100 text-yellow-700',
    poor: 'bg-red-100 text-red-700'
  };

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Asset Register</h1>
        <p className="text-sm text-gray-600 mt-1">Complete asset register with all details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Assets</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalAssets}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <p className="text-sm font-medium text-green-600">Active</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
          <p className="text-sm font-medium text-orange-600">Maintenance</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">{stats.maintenance}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Retired</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.retired}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <p className="text-sm font-medium text-purple-600">Total Value</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">₹{(stats.totalValue / 100000).toFixed(2)}L</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Categories</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Mobile">Mobile</option>
              <option value="Monitor">Monitor</option>
              <option value="Printer">Printer</option>
              <option value="Server">Server</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Export Register
            </button>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
              Print Register
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredData.map((asset, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{asset.assetName}</h3>
                  <p className="text-sm text-gray-600">{asset.assetTag} • {asset.brand} • {asset.serialNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${statusColors[asset.status]}`}>
                  {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${conditionColors[asset.condition]}`}>
                  {asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Category</p>
                <p className="text-sm font-semibold text-gray-900">{asset.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Purchase Date</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {new Date(asset.purchaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Purchase Cost</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <IndianRupee className="h-4 w-4 text-gray-500" />
                  ₹{asset.purchaseCost.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Warranty</p>
                <p className="text-sm font-semibold text-gray-900">{asset.warranty !== 'N/A' ? new Date(asset.warranty).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              {asset.assignedTo && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 uppercase font-medium mb-1">Assigned To</p>
                  <p className="text-sm font-semibold text-green-900">{asset.assignedTo}</p>
                </div>
              )}
              {asset.department && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 uppercase font-medium mb-1">Department</p>
                  <p className="text-sm font-semibold text-blue-900">{asset.department}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Location</p>
                <p className="text-sm font-semibold text-gray-900">{asset.location}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Full Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
