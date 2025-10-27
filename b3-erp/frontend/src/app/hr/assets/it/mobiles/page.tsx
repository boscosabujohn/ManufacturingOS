'use client';

import { useState, useMemo } from 'react';
import { Smartphone, User } from 'lucide-react';

interface MobileAsset {
  id: string;
  assetTag: string;
  brand: string;
  model: string;
  imei: string;
  simNumber?: string;
  os: string;
  storage: string;
  purchaseDate: string;
  cost: number;
  status: 'available' | 'allocated' | 'maintenance' | 'lost';
  assignedTo?: string;
  employeeCode?: string;
  department?: string;
  location: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockMobiles: MobileAsset[] = [
    {
      id: '1',
      assetTag: 'MOB-2024-001',
      brand: 'Samsung',
      model: 'Galaxy S21',
      imei: '352345678901234',
      simNumber: '9876543210',
      os: 'Android 13',
      storage: '128GB',
      purchaseDate: '2024-01-10',
      cost: 45000,
      status: 'allocated',
      assignedTo: 'Arjun Kapoor',
      employeeCode: 'EMP890',
      department: 'Sales',
      location: 'Delhi Office'
    },
    {
      id: '2',
      assetTag: 'MOB-2024-002',
      brand: 'Apple',
      model: 'iPhone 13',
      imei: '352387654321098',
      simNumber: '9123456789',
      os: 'iOS 16',
      storage: '128GB',
      purchaseDate: '2024-02-05',
      cost: 65000,
      status: 'allocated',
      assignedTo: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      location: 'Mumbai Office'
    },
    {
      id: '3',
      assetTag: 'MOB-2023-125',
      brand: 'Samsung',
      model: 'Galaxy M52',
      imei: '358912345678901',
      os: 'Android 12',
      storage: '64GB',
      purchaseDate: '2023-08-15',
      cost: 28000,
      status: 'available',
      location: 'IT Store'
    }
  ];

  const filteredMobiles = mockMobiles.filter(m => selectedStatus === 'all' || m.status === selectedStatus);

  const stats = useMemo(() => ({
    total: mockMobiles.length,
    allocated: mockMobiles.filter(m => m.status === 'allocated').length,
    available: mockMobiles.filter(m => m.status === 'available').length
  }), [mockMobiles]);

  const statusColors = {
    available: 'bg-green-100 text-green-700',
    allocated: 'bg-blue-100 text-blue-700',
    maintenance: 'bg-orange-100 text-orange-700',
    lost: 'bg-red-100 text-red-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mobile Assets</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and track mobile device inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Mobiles</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Allocated</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.allocated}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Available</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.available}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="allocated">Allocated</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Add Mobile
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMobiles.map(mobile => (
          <div key={mobile.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{mobile.brand} {mobile.model}</h3>
                    <p className="text-sm text-gray-600">Asset Tag: {mobile.assetTag} • IMEI: {mobile.imei}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[mobile.status]}`}>
                  {mobile.status.charAt(0).toUpperCase() + mobile.status.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Purchase Cost</p>
                <p className="text-2xl font-bold text-blue-600">₹{mobile.cost.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">OS</p>
                <p className="text-sm font-semibold text-gray-900">{mobile.os}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Storage</p>
                <p className="text-sm font-semibold text-gray-900">{mobile.storage}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">SIM Number</p>
                <p className="text-sm font-semibold text-gray-900">{mobile.simNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Location</p>
                <p className="text-sm font-semibold text-gray-900">{mobile.location}</p>
              </div>
            </div>

            {mobile.assignedTo && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-600 uppercase font-medium mb-1">Assigned To</p>
                <p className="text-sm font-semibold text-blue-900 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {mobile.assignedTo} • {mobile.employeeCode} • {mobile.department}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Details
              </button>
              {mobile.status === 'available' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  Allocate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
