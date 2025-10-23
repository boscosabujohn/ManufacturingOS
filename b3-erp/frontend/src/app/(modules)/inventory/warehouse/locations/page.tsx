'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, Edit2, Trash2, MapPin, Package, Layers, Grid, ChevronRight } from 'lucide-react';

interface Location {
  id: string;
  code: string;
  name: string;
  warehouse: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin: string;
  locationType: 'storage' | 'picking' | 'receiving' | 'shipping' | 'staging';
  capacity: number;
  currentOccupancy: number;
  utilizationPercent: number;
  status: 'available' | 'occupied' | 'reserved' | 'blocked';
  itemsStored: number;
  lastUpdated: string;
}

export default function WarehouseLocationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock warehouse locations data
  const locations: Location[] = [
    {
      id: 'LOC-001',
      code: 'A-01-R01-S01-B01',
      name: 'Zone A - Aisle 1 - Rack 1 - Shelf 1 - Bin 1',
      warehouse: 'Mumbai Central Warehouse',
      zone: 'Zone A',
      aisle: 'A-01',
      rack: 'R01',
      shelf: 'S01',
      bin: 'B01',
      locationType: 'storage',
      capacity: 500,
      currentOccupancy: 450,
      utilizationPercent: 90,
      status: 'occupied',
      itemsStored: 12,
      lastUpdated: '2025-10-20'
    },
    {
      id: 'LOC-002',
      code: 'A-01-R01-S02-B01',
      name: 'Zone A - Aisle 1 - Rack 1 - Shelf 2 - Bin 1',
      warehouse: 'Mumbai Central Warehouse',
      zone: 'Zone A',
      aisle: 'A-01',
      rack: 'R01',
      shelf: 'S02',
      bin: 'B01',
      locationType: 'storage',
      capacity: 500,
      currentOccupancy: 250,
      utilizationPercent: 50,
      status: 'occupied',
      itemsStored: 6,
      lastUpdated: '2025-10-20'
    },
    {
      id: 'LOC-003',
      code: 'A-02-R01-S01-B01',
      name: 'Zone A - Aisle 2 - Rack 1 - Shelf 1 - Bin 1',
      warehouse: 'Mumbai Central Warehouse',
      zone: 'Zone A',
      aisle: 'A-02',
      rack: 'R01',
      shelf: 'S01',
      bin: 'B01',
      locationType: 'picking',
      capacity: 300,
      currentOccupancy: 0,
      utilizationPercent: 0,
      status: 'available',
      itemsStored: 0,
      lastUpdated: '2025-10-19'
    },
    {
      id: 'LOC-004',
      code: 'B-01-R01-S01-B01',
      name: 'Zone B - Aisle 1 - Rack 1 - Shelf 1 - Bin 1',
      warehouse: 'Mumbai Central Warehouse',
      zone: 'Zone B',
      aisle: 'B-01',
      rack: 'R01',
      shelf: 'S01',
      bin: 'B01',
      locationType: 'storage',
      capacity: 600,
      currentOccupancy: 580,
      utilizationPercent: 97,
      status: 'occupied',
      itemsStored: 15,
      lastUpdated: '2025-10-20'
    },
    {
      id: 'LOC-005',
      code: 'RCV-01',
      name: 'Receiving Dock 1',
      warehouse: 'Mumbai Central Warehouse',
      zone: 'Receiving Area',
      aisle: 'RCV',
      rack: '-',
      shelf: '-',
      bin: '-',
      locationType: 'receiving',
      capacity: 2000,
      currentOccupancy: 450,
      utilizationPercent: 23,
      status: 'occupied',
      itemsStored: 8,
      lastUpdated: '2025-10-20'
    },
    {
      id: 'LOC-006',
      code: 'SHIP-01',
      name: 'Shipping Dock 1',
      warehouse: 'Mumbai Central Warehouse',
      zone: 'Shipping Area',
      aisle: 'SHIP',
      rack: '-',
      shelf: '-',
      bin: '-',
      locationType: 'shipping',
      capacity: 1500,
      currentOccupancy: 800,
      utilizationPercent: 53,
      status: 'occupied',
      itemsStored: 20,
      lastUpdated: '2025-10-20'
    },
    {
      id: 'LOC-007',
      code: 'STG-01',
      name: 'Staging Area 1',
      warehouse: 'Delhi Regional Hub',
      zone: 'Staging',
      aisle: 'STG',
      rack: '-',
      shelf: '-',
      bin: '-',
      locationType: 'staging',
      capacity: 1000,
      currentOccupancy: 350,
      utilizationPercent: 35,
      status: 'occupied',
      itemsStored: 10,
      lastUpdated: '2025-10-20'
    },
    {
      id: 'LOC-008',
      code: 'A-01-R02-S01-B01',
      name: 'Zone A - Aisle 1 - Rack 2 - Shelf 1 - Bin 1',
      warehouse: 'Delhi Regional Hub',
      zone: 'Zone A',
      aisle: 'A-01',
      rack: 'R02',
      shelf: 'S01',
      bin: 'B01',
      locationType: 'storage',
      capacity: 450,
      currentOccupancy: 0,
      utilizationPercent: 0,
      status: 'reserved',
      itemsStored: 0,
      lastUpdated: '2025-10-19'
    },
    {
      id: 'LOC-009',
      code: 'C-01-R01-S01-B01',
      name: 'Zone C - Aisle 1 - Rack 1 - Shelf 1 - Bin 1',
      warehouse: 'Bangalore Factory Store',
      zone: 'Zone C',
      aisle: 'C-01',
      rack: 'R01',
      shelf: 'S01',
      bin: 'B01',
      locationType: 'storage',
      capacity: 550,
      currentOccupancy: 0,
      utilizationPercent: 0,
      status: 'blocked',
      itemsStored: 0,
      lastUpdated: '2025-10-18'
    },
    {
      id: 'LOC-010',
      code: 'A-03-R01-S01-B01',
      name: 'Zone A - Aisle 3 - Rack 1 - Shelf 1 - Bin 1',
      warehouse: 'Bangalore Factory Store',
      zone: 'Zone A',
      aisle: 'A-03',
      rack: 'R01',
      shelf: 'S01',
      bin: 'B01',
      locationType: 'picking',
      capacity: 400,
      currentOccupancy: 320,
      utilizationPercent: 80,
      status: 'occupied',
      itemsStored: 18,
      lastUpdated: '2025-10-20'
    }
  ];

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loc.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = filterWarehouse === 'all' || loc.warehouse === filterWarehouse;
    const matchesStatus = filterStatus === 'all' || loc.status === filterStatus;
    const matchesType = filterType === 'all' || loc.locationType === filterType;
    return matchesSearch && matchesWarehouse && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'occupied': return 'bg-blue-100 text-blue-700';
      case 'reserved': return 'bg-yellow-100 text-yellow-700';
      case 'blocked': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'storage': return 'bg-purple-100 text-purple-700';
      case 'picking': return 'bg-green-100 text-green-700';
      case 'receiving': return 'bg-blue-100 text-blue-700';
      case 'shipping': return 'bg-orange-100 text-orange-700';
      case 'staging': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 70) return 'text-yellow-600';
    if (utilization >= 50) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Warehouse Locations</h1>
            <p className="text-sm text-gray-500 mt-1">Manage storage locations and bins across warehouses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Location</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Locations</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{locations.length}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Available</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {locations.filter(loc => loc.status === 'available').length}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Grid className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Occupied</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {locations.filter(loc => loc.status === 'occupied').length}
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Package className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Utilization</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {(locations.reduce((sum, loc) => sum + loc.utilizationPercent, 0) / locations.length).toFixed(0)}%
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <Layers className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterWarehouse}
            onChange={(e) => setFilterWarehouse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Warehouses</option>
            <option value="Mumbai Central Warehouse">Mumbai Central</option>
            <option value="Delhi Regional Hub">Delhi Regional</option>
            <option value="Bangalore Factory Store">Bangalore Factory</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="storage">Storage</option>
            <option value="picking">Picking</option>
            <option value="receiving">Receiving</option>
            <option value="shipping">Shipping</option>
            <option value="staging">Staging</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Locations List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone/Aisle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rack/Shelf/Bin</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Occupancy</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLocations.map((loc) => (
                <tr key={loc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono font-bold text-gray-900">{loc.code}</div>
                    <div className="text-xs text-gray-500 mt-1">Updated: {loc.lastUpdated}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{loc.warehouse}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{loc.zone}</div>
                    <div className="text-xs text-gray-500">{loc.aisle}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-600">
                      {loc.rack} / {loc.shelf} / {loc.bin}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(loc.locationType)}`}>
                      {loc.locationType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">{loc.capacity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{loc.currentOccupancy}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-sm font-bold ${getUtilizationColor(loc.utilizationPercent)}`}>
                        {loc.utilizationPercent}%
                      </span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${loc.utilizationPercent >= 90 ? 'bg-red-500' : loc.utilizationPercent >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${loc.utilizationPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center font-semibold">{loc.itemsStored}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loc.status)}`}>
                      {loc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
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

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No locations found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
