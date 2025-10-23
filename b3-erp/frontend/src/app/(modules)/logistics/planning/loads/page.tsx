'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Eye,
  Search,
  Weight,
  Box,
  TrendingUp,
  Truck,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface LoadDetails {
  id: number;
  loadId: string;
  loadName: string;
  vehicleType: string;
  origin: string;
  destination: string;
  shipments: number;
  totalWeight: number; // in kg
  totalVolume: number; // in cubic meters
  vehicleCapacityWeight: number;
  vehicleCapacityVolume: number;
  loadingDate: string;
  estimatedDeparture: string;
  routeCode: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  loadUtilization: number; // percentage
  status: 'planning' | 'ready' | 'loading' | 'loaded' | 'dispatched';
  assignedTo: string;
  specialRequirements: string[];
  totalValue: number;
}

export default function LoadPlanningPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const [loads, setLoads] = useState<LoadDetails[]>([
    {
      id: 1,
      loadId: 'LD-2024-001',
      loadName: 'Mumbai-Delhi Load #1',
      vehicleType: '32-Ft Truck',
      origin: 'Mumbai Warehouse',
      destination: 'Delhi Distribution Center',
      shipments: 15,
      totalWeight: 18500,
      totalVolume: 42,
      vehicleCapacityWeight: 20000,
      vehicleCapacityVolume: 45,
      loadingDate: '2024-10-22',
      estimatedDeparture: '2024-10-22 18:00',
      routeCode: 'RT-MUM-DEL-001',
      priority: 'high',
      loadUtilization: 93,
      status: 'ready',
      assignedTo: 'Rajesh Kumar',
      specialRequirements: ['Temperature Controlled', 'Fragile Items'],
      totalValue: 2500000
    },
    {
      id: 2,
      loadId: 'LD-2024-002',
      loadName: 'Bangalore-Chennai Load #1',
      vehicleType: '20-Ft Container',
      origin: 'Bangalore Plant',
      destination: 'Chennai Port',
      shipments: 8,
      totalWeight: 8200,
      totalVolume: 18,
      vehicleCapacityWeight: 10000,
      vehicleCapacityVolume: 22,
      loadingDate: '2024-10-23',
      estimatedDeparture: '2024-10-23 08:00',
      routeCode: 'RT-BLR-CHN-001',
      priority: 'urgent',
      loadUtilization: 82,
      status: 'planning',
      assignedTo: 'Priya Singh',
      specialRequirements: ['Export Documentation'],
      totalValue: 1200000
    },
    {
      id: 3,
      loadId: 'LD-2024-003',
      loadName: 'Kolkata-Mumbai Load #1',
      vehicleType: '40-Ft Truck',
      origin: 'Kolkata Depot',
      destination: 'Mumbai Warehouse',
      shipments: 22,
      totalWeight: 28000,
      totalVolume: 65,
      vehicleCapacityWeight: 30000,
      vehicleCapacityVolume: 68,
      loadingDate: '2024-10-22',
      estimatedDeparture: '2024-10-22 06:00',
      routeCode: 'RT-KOL-MUM-001',
      priority: 'normal',
      loadUtilization: 96,
      status: 'loading',
      assignedTo: 'Amit Patel',
      specialRequirements: [],
      totalValue: 3800000
    },
    {
      id: 4,
      loadId: 'LD-2024-004',
      loadName: 'Hyderabad-Bangalore Load #2',
      vehicleType: '24-Ft Truck',
      origin: 'Hyderabad Factory',
      destination: 'Bangalore Plant',
      shipments: 12,
      totalWeight: 11500,
      totalVolume: 28,
      vehicleCapacityWeight: 15000,
      vehicleCapacityVolume: 32,
      loadingDate: '2024-10-21',
      estimatedDeparture: '2024-10-21 14:00',
      routeCode: 'RT-HYD-BLR-001',
      priority: 'high',
      loadUtilization: 88,
      status: 'dispatched',
      assignedTo: 'Vikram Malhotra',
      specialRequirements: ['Hazardous Materials'],
      totalValue: 1800000
    },
    {
      id: 5,
      loadId: 'LD-2024-005',
      loadName: 'Pune-Goa Load #1',
      vehicleType: '18-Ft Truck',
      origin: 'Pune Hub',
      destination: 'Goa Distribution',
      shipments: 6,
      totalWeight: 4500,
      totalVolume: 12,
      vehicleCapacityWeight: 8000,
      vehicleCapacityVolume: 16,
      loadingDate: '2024-10-24',
      estimatedDeparture: '2024-10-24 10:00',
      routeCode: 'RT-PUN-GOA-001',
      priority: 'low',
      loadUtilization: 75,
      status: 'planning',
      assignedTo: 'Sunita Desai',
      specialRequirements: [],
      totalValue: 650000
    },
    {
      id: 6,
      loadId: 'LD-2024-006',
      loadName: 'Delhi-Jammu Load #1',
      vehicleType: '28-Ft Truck',
      origin: 'Delhi Distribution Center',
      destination: 'Jammu Depot',
      shipments: 10,
      totalWeight: 14000,
      totalVolume: 35,
      vehicleCapacityWeight: 18000,
      vehicleCapacityVolume: 38,
      loadingDate: '2024-10-22',
      estimatedDeparture: '2024-10-22 22:00',
      routeCode: 'RT-DEL-JAM-001',
      priority: 'normal',
      loadUtilization: 92,
      status: 'loaded',
      assignedTo: 'Rajesh Kumar',
      specialRequirements: ['Cold Chain'],
      totalValue: 2100000
    },
    {
      id: 7,
      loadId: 'LD-2024-007',
      loadName: 'Chennai-Kochi Load #1',
      vehicleType: '32-Ft Truck',
      origin: 'Chennai Port',
      destination: 'Kochi Depot',
      shipments: 14,
      totalWeight: 16800,
      totalVolume: 40,
      vehicleCapacityWeight: 20000,
      vehicleCapacityVolume: 45,
      loadingDate: '2024-10-23',
      estimatedDeparture: '2024-10-23 16:00',
      routeCode: 'RT-CHN-KOC-001',
      priority: 'high',
      loadUtilization: 89,
      status: 'ready',
      assignedTo: 'Priya Singh',
      specialRequirements: ['Oversized Items'],
      totalValue: 2800000
    },
    {
      id: 8,
      loadId: 'LD-2024-008',
      loadName: 'Ahmedabad-Mumbai Load #3',
      vehicleType: '20-Ft Truck',
      origin: 'Ahmedabad Factory',
      destination: 'Mumbai Warehouse',
      shipments: 9,
      totalWeight: 7200,
      totalVolume: 16,
      vehicleCapacityWeight: 10000,
      vehicleCapacityVolume: 22,
      loadingDate: '2024-10-21',
      estimatedDeparture: '2024-10-21 20:00',
      routeCode: 'RT-AHM-MUM-001',
      priority: 'normal',
      loadUtilization: 73,
      status: 'dispatched',
      assignedTo: 'Amit Patel',
      specialRequirements: [],
      totalValue: 980000
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'planning': 'text-blue-600 bg-blue-50 border-blue-200',
      'ready': 'text-green-600 bg-green-50 border-green-200',
      'loading': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'loaded': 'text-purple-600 bg-purple-50 border-purple-200',
      'dispatched': 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'urgent': 'text-red-600 bg-red-50 border-red-200',
      'high': 'text-orange-600 bg-orange-50 border-orange-200',
      'normal': 'text-blue-600 bg-blue-50 border-blue-200',
      'low': 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-green-600';
    if (utilization >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalLoads = loads.length;
  const readyLoads = loads.filter(l => l.status === 'ready' || l.status === 'loaded').length;
  const avgUtilization = (loads.reduce((sum, l) => sum + l.loadUtilization, 0) / totalLoads).toFixed(1);
  const totalShipments = loads.reduce((sum, l) => sum + l.shipments, 0);

  const filteredLoads = loads.filter(load => {
    const matchesSearch = load.loadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         load.loadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         load.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         load.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || load.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || load.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Package className="w-8 h-8 text-green-600" />
            <span>Load Planning</span>
          </h1>
          <p className="text-gray-600 mt-1">Optimize vehicle loading and cargo consolidation</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Load</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{totalLoads}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Total Loads</div>
          <div className="text-xs text-green-600 mt-1">Active Planning</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{readyLoads}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Ready for Dispatch</div>
          <div className="text-xs text-blue-600 mt-1">Loaded & Ready</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{avgUtilization}%</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Avg Utilization</div>
          <div className="text-xs text-purple-600 mt-1">Capacity Usage</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Box className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{totalShipments}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Total Shipments</div>
          <div className="text-xs text-orange-600 mt-1">In All Loads</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search loads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="ready">Ready</option>
            <option value="loading">Loading</option>
            <option value="loaded">Loaded</option>
            <option value="dispatched">Dispatched</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Loads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight/Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoads.map((load) => (
                <tr key={load.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{load.loadId}</div>
                    <div className="text-sm text-gray-600">{load.loadName}</div>
                    <div className="text-xs text-gray-500 mt-1">Assigned: {load.assignedTo}</div>
                    {load.specialRequirements.length > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-600">{load.specialRequirements.join(', ')}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span>{load.vehicleType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{load.origin}</div>
                    <div className="text-sm text-gray-600">→ {load.destination}</div>
                    <div className="text-xs text-gray-500 mt-1">{load.routeCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Box className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900">{load.shipments}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Weight className="w-3 h-3 text-gray-400" />
                        <span>{(load.totalWeight / 1000).toFixed(1)}T / {(load.vehicleCapacityWeight / 1000).toFixed(1)}T</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Box className="w-3 h-3 text-gray-400" />
                        <span>{load.totalVolume}m³ / {load.vehicleCapacityVolume}m³</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div
                          className={`h-2 rounded-full ${
                            load.loadUtilization >= 90 ? 'bg-green-500' :
                            load.loadUtilization >= 75 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${load.loadUtilization}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${getUtilizationColor(load.loadUtilization)}`}>
                        {load.loadUtilization}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(load.priority)}`}>
                      {load.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div>{new Date(load.estimatedDeparture).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{new Date(load.estimatedDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(load.status)}`}>
                      {load.status.toUpperCase()}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Load Optimization Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Load Optimization</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Maximize vehicle capacity utilization by consolidating shipments efficiently.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Target: 90%+ utilization for efficiency</div>
            <div>• Weight and volume constraints</div>
            <div>• Consider route compatibility</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Vehicle Selection</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Choose appropriate vehicle type based on cargo requirements and route conditions.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Match capacity to load requirements</div>
            <div>• Special requirements (temp control, etc.)</div>
            <div>• Cost optimization</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Special Requirements</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Handle cargo with specific handling, storage, or transport requirements.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Temperature controlled goods</div>
            <div>• Fragile or hazardous materials</div>
            <div>• Oversized items or special handling</div>
          </div>
        </div>
      </div>
    </div>
  );
}
