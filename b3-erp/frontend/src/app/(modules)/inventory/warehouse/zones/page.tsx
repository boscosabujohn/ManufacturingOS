'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, Edit2, Trash2, Grid, Package, Thermometer, Shield, TrendingUp } from 'lucide-react';
import {
  CreateZoneModal,
  CreateBinModal,
  ZoneData,
  BinData
} from '@/components/inventory/InventoryWarehouseModals';

interface Zone {
  id: string;
  code: string;
  name: string;
  warehouse: string;
  zoneType: 'storage' | 'picking' | 'receiving' | 'shipping' | 'cold-storage' | 'hazardous' | 'quarantine';
  area: number;
  capacity: number;
  currentOccupancy: number;
  utilizationPercent: number;
  totalLocations: number;
  availableLocations: number;
  temperature: string;
  status: 'active' | 'inactive' | 'maintenance';
  manager: string;
  specialRequirements: string[];
}

export default function WarehouseZonesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal states
  const [isCreateZoneOpen, setIsCreateZoneOpen] = useState(false);
  const [isCreateBinOpen, setIsCreateBinOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedZoneIdForBin, setSelectedZoneIdForBin] = useState<string>('');
  const [zoneList, setZoneList] = useState<Zone[]>([]);

  // Mock warehouse zones data
  const zones: Zone[] = [
    {
      id: 'ZONE-001',
      code: 'MUM-A',
      name: 'Zone A - General Storage',
      warehouse: 'Mumbai Central Warehouse',
      zoneType: 'storage',
      area: 5000,
      capacity: 10000,
      currentOccupancy: 8500,
      utilizationPercent: 85,
      totalLocations: 200,
      availableLocations: 30,
      temperature: 'Ambient (15-25°C)',
      status: 'active',
      manager: 'Rajesh Kumar',
      specialRequirements: ['Dry', 'Ventilated']
    },
    {
      id: 'ZONE-002',
      code: 'MUM-B',
      name: 'Zone B - Picking Area',
      warehouse: 'Mumbai Central Warehouse',
      zoneType: 'picking',
      area: 2500,
      capacity: 5000,
      currentOccupancy: 3200,
      utilizationPercent: 64,
      totalLocations: 100,
      availableLocations: 36,
      temperature: 'Ambient (15-25°C)',
      status: 'active',
      manager: 'Priya Sharma',
      specialRequirements: ['High Traffic', 'Well-lit']
    },
    {
      id: 'ZONE-003',
      code: 'MUM-C',
      name: 'Zone C - Cold Storage',
      warehouse: 'Mumbai Central Warehouse',
      zoneType: 'cold-storage',
      area: 1500,
      capacity: 3000,
      currentOccupancy: 2700,
      utilizationPercent: 90,
      totalLocations: 50,
      availableLocations: 5,
      temperature: 'Cold (2-8°C)',
      status: 'active',
      manager: 'Amit Patel',
      specialRequirements: ['Temperature Controlled', 'Humidity Control', 'Backup Power']
    },
    {
      id: 'ZONE-004',
      code: 'MUM-RCV',
      name: 'Receiving Zone',
      warehouse: 'Mumbai Central Warehouse',
      zoneType: 'receiving',
      area: 1000,
      capacity: 2000,
      currentOccupancy: 450,
      utilizationPercent: 23,
      totalLocations: 20,
      availableLocations: 15,
      temperature: 'Ambient (15-25°C)',
      status: 'active',
      manager: 'Sunita Reddy',
      specialRequirements: ['Loading Docks', 'Inspection Area']
    },
    {
      id: 'ZONE-005',
      code: 'MUM-SHIP',
      name: 'Shipping Zone',
      warehouse: 'Mumbai Central Warehouse',
      zoneType: 'shipping',
      area: 1000,
      capacity: 2000,
      currentOccupancy: 800,
      utilizationPercent: 40,
      totalLocations: 20,
      availableLocations: 12,
      temperature: 'Ambient (15-25°C)',
      status: 'active',
      manager: 'Vikram Singh',
      specialRequirements: ['Loading Docks', 'Staging Area']
    },
    {
      id: 'ZONE-006',
      code: 'DEL-A',
      name: 'Zone A - General Storage',
      warehouse: 'Delhi Regional Hub',
      zoneType: 'storage',
      area: 4000,
      capacity: 8000,
      currentOccupancy: 5200,
      utilizationPercent: 65,
      totalLocations: 160,
      availableLocations: 56,
      temperature: 'Ambient (15-25°C)',
      status: 'active',
      manager: 'Lakshmi Iyer',
      specialRequirements: ['Dry', 'Secure']
    },
    {
      id: 'ZONE-007',
      code: 'DEL-HAZ',
      name: 'Hazardous Materials Zone',
      warehouse: 'Delhi Regional Hub',
      zoneType: 'hazardous',
      area: 800,
      capacity: 1500,
      currentOccupancy: 450,
      utilizationPercent: 30,
      totalLocations: 30,
      availableLocations: 21,
      temperature: 'Controlled (18-22°C)',
      status: 'active',
      manager: 'Mohammed Ali',
      specialRequirements: ['Fire Suppression', 'Spill Containment', 'Safety Equipment', 'Restricted Access']
    },
    {
      id: 'ZONE-008',
      code: 'BLR-A',
      name: 'Zone A - High Velocity',
      warehouse: 'Bangalore Factory Store',
      zoneType: 'storage',
      area: 3500,
      capacity: 7000,
      currentOccupancy: 6440,
      utilizationPercent: 92,
      totalLocations: 140,
      availableLocations: 11,
      temperature: 'Ambient (15-25°C)',
      status: 'active',
      manager: 'Anjali Mehta',
      specialRequirements: ['Quick Access', 'High Turnover']
    },
    {
      id: 'ZONE-009',
      code: 'BLR-QTN',
      name: 'Quarantine Zone',
      warehouse: 'Bangalore Factory Store',
      zoneType: 'quarantine',
      area: 500,
      capacity: 1000,
      currentOccupancy: 150,
      utilizationPercent: 15,
      totalLocations: 20,
      availableLocations: 17,
      temperature: 'Ambient (15-25°C)',
      status: 'active',
      manager: 'Karthik Rao',
      specialRequirements: ['Isolated', 'Inspection Ready', 'Hold Status']
    },
    {
      id: 'ZONE-010',
      code: 'CHN-A',
      name: 'Zone A - Distribution',
      warehouse: 'Chennai Distribution Center',
      zoneType: 'storage',
      area: 4500,
      capacity: 9000,
      currentOccupancy: 7200,
      utilizationPercent: 80,
      totalLocations: 180,
      availableLocations: 36,
      temperature: 'Ambient (15-25°C)',
      status: 'maintenance',
      manager: 'Deepak Nair',
      specialRequirements: ['Ventilated', 'Pest Control']
    }
  ];

  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         zone.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = filterWarehouse === 'all' || zone.warehouse === filterWarehouse;
    const matchesType = filterType === 'all' || zone.zoneType === filterType;
    return matchesSearch && matchesWarehouse && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'storage': return 'bg-blue-100 text-blue-700';
      case 'picking': return 'bg-green-100 text-green-700';
      case 'receiving': return 'bg-purple-100 text-purple-700';
      case 'shipping': return 'bg-orange-100 text-orange-700';
      case 'cold-storage': return 'bg-cyan-100 text-cyan-700';
      case 'hazardous': return 'bg-red-100 text-red-700';
      case 'quarantine': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cold-storage': return <Thermometer className="w-4 h-4" />;
      case 'hazardous': return <Shield className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Convert Zone to ZoneData
  const convertToZoneData = (zone: Zone): ZoneData => {
    return {
      zoneId: zone.id,
      zoneName: zone.name,
      zoneCode: zone.code,
      warehouseId: 'WH-001', // Default warehouse ID
      zoneType: zone.zoneType === 'cold-storage' ? 'storage' : zone.zoneType === 'hazardous' ? 'quarantine' : zone.zoneType,
      capacity: zone.capacity,
      currentUtilization: zone.utilizationPercent,
      temperature: zone.temperature.includes('Cold') || zone.temperature.includes('Controlled') ? {
        min: 2,
        max: 8,
        controlled: true
      } : undefined,
      bins: [],
      restrictions: zone.specialRequirements
    };
  };

  // Handle zone creation
  const handleCreateZone = (data: ZoneData) => {
    // TODO: Integrate with API to create zone
    console.log('Creating zone:', data);

    // Update local state
    const newZone: Zone = {
      id: data.zoneId,
      code: data.zoneCode,
      name: data.zoneName,
      warehouse: 'Mumbai Central Warehouse', // Default warehouse
      zoneType: data.zoneType,
      area: data.capacity / 2, // Estimate area
      capacity: data.capacity,
      currentOccupancy: 0,
      utilizationPercent: 0,
      totalLocations: 0,
      availableLocations: 0,
      temperature: data.temperature ? `Controlled (${data.temperature.min}-${data.temperature.max}°C)` : 'Ambient (15-25°C)',
      status: 'active',
      manager: 'Warehouse Manager',
      specialRequirements: data.restrictions || []
    };

    setZoneList([...zoneList, newZone]);
    setIsCreateZoneOpen(false);
  };

  // Handle zone card click to view details
  const handleZoneClick = (zone: Zone) => {
    setSelectedZone(zone);
    // Could open a details modal here if needed
    console.log('Zone clicked:', zone);
  };

  // Handle add bin from zone
  const handleAddBinToZone = (zoneId: string) => {
    setSelectedZoneIdForBin(zoneId);
    setIsCreateBinOpen(true);
  };

  // Handle bin creation
  const handleCreateBin = (data: BinData) => {
    // TODO: Integrate with API to create bin
    console.log('Creating bin:', data);

    // Update zone locations count
    const updatedZones = zoneList.map(zone => {
      if (zone.id === data.zoneId) {
        return {
          ...zone,
          totalLocations: zone.totalLocations + 1,
          availableLocations: zone.availableLocations + 1
        };
      }
      return zone;
    });

    setZoneList(updatedZones);
    setIsCreateBinOpen(false);
    setSelectedZoneIdForBin('');
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
            <h1 className="text-2xl font-bold text-gray-900">Warehouse Zones</h1>
            <p className="text-sm text-gray-500 mt-1">Manage warehouse zones and area configurations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateZoneOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Zone</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Zones</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{zones.length}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Grid className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Zones</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {zones.filter(z => z.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Area</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {(zones.reduce((sum, z) => sum + z.area, 0) / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-purple-600 mt-1">sq. meters</p>
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
                {(zones.reduce((sum, z) => sum + z.utilizationPercent, 0) / zones.length).toFixed(0)}%
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search zones..."
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
            <option value="Chennai Distribution Center">Chennai Distribution</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Zone Types</option>
            <option value="storage">Storage</option>
            <option value="picking">Picking</option>
            <option value="receiving">Receiving</option>
            <option value="shipping">Shipping</option>
            <option value="cold-storage">Cold Storage</option>
            <option value="hazardous">Hazardous</option>
            <option value="quarantine">Quarantine</option>
          </select>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredZones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleZoneClick(zone)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getTypeColor(zone.zoneType)} bg-opacity-20`}>
                  {getTypeIcon(zone.zoneType)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{zone.name}</h3>
                  <p className="text-sm text-gray-500">{zone.warehouse}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(zone.zoneType)}`}>
                  {zone.zoneType}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(zone.status)}`}>
                  {zone.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Zone Code</p>
                <p className="text-sm font-mono font-bold text-gray-900">{zone.code}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Manager</p>
                <p className="text-sm font-semibold text-gray-900">{zone.manager}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Area</p>
                <p className="text-sm font-semibold text-gray-900">{zone.area.toLocaleString()} m²</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Temperature</p>
                <p className="text-sm font-semibold text-gray-900">{zone.temperature}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Capacity Utilization</span>
                <span className={`text-sm font-bold ${getUtilizationColor(zone.utilizationPercent)}`}>
                  {zone.utilizationPercent}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${zone.utilizationPercent >= 90 ? 'bg-red-500' : zone.utilizationPercent >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${zone.utilizationPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>{zone.currentOccupancy.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Total Locations</p>
                <p className="text-lg font-bold text-gray-900">{zone.totalLocations}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Available Locations</p>
                <p className="text-lg font-bold text-green-600">{zone.availableLocations}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Special Requirements</p>
              <div className="flex flex-wrap gap-1">
                {zone.specialRequirements.map((req, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddBinToZone(zone.id);
                }}
                className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1 text-sm"
              >
                <Plus className="w-3 h-3" />
                Add Bin
              </button>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoneClick(zone);
                  }}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 text-sm"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 text-sm"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredZones.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          <div className="text-center">
            <p className="text-gray-500">No zones found matching your criteria</p>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateZoneModal
        isOpen={isCreateZoneOpen}
        onClose={() => setIsCreateZoneOpen(false)}
        onSubmit={handleCreateZone}
      />

      <CreateBinModal
        isOpen={isCreateBinOpen}
        onClose={() => {
          setIsCreateBinOpen(false);
          setSelectedZoneIdForBin('');
        }}
        onSubmit={handleCreateBin}
        zoneId={selectedZoneIdForBin}
      />
    </div>
  );
}
