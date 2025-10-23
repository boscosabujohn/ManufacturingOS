'use client';

import React, { useState } from 'react';
import {
  Warehouse,
  Plus,
  Edit2,
  Eye,
  Search,
  MapPin,
  Package,
  Percent
} from 'lucide-react';

interface StorageLocation {
  id: number;
  locationCode: string;
  locationName: string;
  warehouse: string;
  zone: string;
  aisle?: string;
  rack?: string;
  bin?: string;
  locationType: 'storage' | 'picking' | 'receiving' | 'shipping' | 'quarantine';
  capacity: number;
  currentOccupancy: number;
  status: 'active' | 'inactive' | 'maintenance';
  itemsStored: number;
}

export default function StorageLocationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const [locations, setLocations] = useState<StorageLocation[]>([
    {
      id: 1,
      locationCode: 'MW-A1-R1-B1',
      locationName: 'Main Warehouse - Aisle A1 - Rack 1 - Bin 1',
      warehouse: 'Main Warehouse',
      zone: 'Zone A',
      aisle: 'A1',
      rack: 'R1',
      bin: 'B1',
      locationType: 'storage',
      capacity: 100,
      currentOccupancy: 85,
      status: 'active',
      itemsStored: 12
    },
    {
      id: 2,
      locationCode: 'MW-A1-R1-B2',
      locationName: 'Main Warehouse - Aisle A1 - Rack 1 - Bin 2',
      warehouse: 'Main Warehouse',
      zone: 'Zone A',
      aisle: 'A1',
      rack: 'R1',
      bin: 'B2',
      locationType: 'storage',
      capacity: 100,
      currentOccupancy: 45,
      status: 'active',
      itemsStored: 8
    },
    {
      id: 3,
      locationCode: 'MW-PICK-01',
      locationName: 'Main Warehouse - Picking Area 1',
      warehouse: 'Main Warehouse',
      zone: 'Picking Zone',
      locationType: 'picking',
      capacity: 50,
      currentOccupancy: 32,
      status: 'active',
      itemsStored: 15
    },
    {
      id: 4,
      locationCode: 'RM-B2-R3-B5',
      locationName: 'RM Store - Aisle B2 - Rack 3 - Bin 5',
      warehouse: 'RM Store',
      zone: 'Zone B',
      aisle: 'B2',
      rack: 'R3',
      bin: 'B5',
      locationType: 'storage',
      capacity: 120,
      currentOccupancy: 98,
      status: 'active',
      itemsStored: 18
    },
    {
      id: 5,
      locationCode: 'FG-SHIP-02',
      locationName: 'FG Store - Shipping Dock 2',
      warehouse: 'FG Store',
      zone: 'Shipping Area',
      locationType: 'shipping',
      capacity: 200,
      currentOccupancy: 145,
      status: 'active',
      itemsStored: 25
    },
    {
      id: 6,
      locationCode: 'MW-QC-01',
      locationName: 'Main Warehouse - QC Quarantine Area',
      warehouse: 'Main Warehouse',
      zone: 'Quality Zone',
      locationType: 'quarantine',
      capacity: 30,
      currentOccupancy: 8,
      status: 'active',
      itemsStored: 4
    },
    {
      id: 7,
      locationCode: 'AP-C1-R2-B3',
      locationName: 'Assembly Plant - Aisle C1 - Rack 2 - Bin 3',
      warehouse: 'Assembly Plant',
      zone: 'Zone C',
      aisle: 'C1',
      rack: 'R2',
      bin: 'B3',
      locationType: 'storage',
      capacity: 80,
      currentOccupancy: 65,
      status: 'active',
      itemsStored: 10
    },
    {
      id: 8,
      locationCode: 'SP-D3-R1-B8',
      locationName: 'Spares Store - Aisle D3 - Rack 1 - Bin 8',
      warehouse: 'Spares Store',
      zone: 'Zone D',
      aisle: 'D3',
      rack: 'R1',
      bin: 'B8',
      locationType: 'storage',
      capacity: 60,
      currentOccupancy: 15,
      status: 'active',
      itemsStored: 6
    },
    {
      id: 9,
      locationCode: 'MW-RCV-01',
      locationName: 'Main Warehouse - Receiving Dock 1',
      warehouse: 'Main Warehouse',
      zone: 'Receiving Area',
      locationType: 'receiving',
      capacity: 150,
      currentOccupancy: 72,
      status: 'active',
      itemsStored: 20
    },
    {
      id: 10,
      locationCode: 'MW-A2-R5-B4',
      locationName: 'Main Warehouse - Aisle A2 - Rack 5 - Bin 4',
      warehouse: 'Main Warehouse',
      zone: 'Zone A',
      aisle: 'A2',
      rack: 'R5',
      bin: 'B4',
      locationType: 'storage',
      capacity: 100,
      currentOccupancy: 0,
      status: 'maintenance',
      itemsStored: 0
    }
  ]);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'storage': 'text-blue-600 bg-blue-50 border-blue-200',
      'picking': 'text-green-600 bg-green-50 border-green-200',
      'receiving': 'text-purple-600 bg-purple-50 border-purple-200',
      'shipping': 'text-orange-600 bg-orange-50 border-orange-200',
      'quarantine': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  const activeLocations = locations.filter(l => l.status === 'active').length;
  const totalCapacity = locations.reduce((sum, l) => sum + l.capacity, 0);
  const totalOccupancy = locations.reduce((sum, l) => sum + l.currentOccupancy, 0);
  const avgUtilization = ((totalOccupancy / totalCapacity) * 100).toFixed(1);

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.locationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = selectedWarehouse === 'all' || location.warehouse === selectedWarehouse;
    const matchesType = selectedType === 'all' || location.locationType === selectedType;
    return matchesSearch && matchesWarehouse && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <span>Storage Locations</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage warehouse storage location hierarchy</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Location</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{activeLocations}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Active Locations</div>
          <div className="text-xs text-blue-600 mt-1">In Operation</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Warehouse className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{totalCapacity}</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Total Capacity</div>
          <div className="text-xs text-purple-600 mt-1">Cubic Meters</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{totalOccupancy}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Current Occupancy</div>
          <div className="text-xs text-orange-600 mt-1">Cubic Meters Used</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Percent className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{avgUtilization}%</span>
          </div>
          <div className="text-sm font-medium text-green-700">Avg Utilization</div>
          <div className="text-xs text-green-600 mt-1">Space Efficiency</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search locations..."
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
            <option value="RM Store">RM Store</option>
            <option value="FG Store">FG Store</option>
            <option value="Assembly Plant">Assembly Plant</option>
            <option value="Spares Store">Spares Store</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="storage">Storage</option>
            <option value="picking">Picking</option>
            <option value="receiving">Receiving</option>
            <option value="shipping">Shipping</option>
            <option value="quarantine">Quarantine</option>
          </select>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Stored</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.map((location) => {
                const utilization = ((location.currentOccupancy / location.capacity) * 100).toFixed(1);
                return (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">{location.locationCode}</div>
                      <div className="text-xs text-gray-500">{location.aisle && `Aisle ${location.aisle} - `}{location.rack && `Rack ${location.rack} - `}{location.bin && `Bin ${location.bin}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Warehouse className="w-4 h-4 text-gray-400" />
                        <span>{location.warehouse}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {location.zone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(location.locationType)}`}>
                        {location.locationType.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {location.capacity} m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {location.currentOccupancy} m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                          <div
                            className={`h-2 rounded-full ${
                              parseFloat(utilization) >= 90 ? 'bg-red-500' :
                              parseFloat(utilization) >= 70 ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${utilization}%` }}
                          />
                        </div>
                        <span className={`font-bold ${getOccupancyColor(parseFloat(utilization))}`}>
                          {utilization}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {location.itemsStored}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(location.status)}`}>
                        {location.status.toUpperCase()}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
