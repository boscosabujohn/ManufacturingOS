'use client';

import React, { useState } from 'react';
import {
  Route,
  Plus,
  Edit2,
  Eye,
  Search,
  MapPin,
  Navigation,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  Truck,
  AlertCircle
} from 'lucide-react';

interface RouteDetails {
  id: number;
  routeCode: string;
  routeName: string;
  origin: string;
  destination: string;
  waypoints: string[];
  distance: number; // in km
  estimatedTime: number; // in hours
  routeType: 'primary' | 'alternate' | 'emergency';
  transportMode: 'road' | 'rail' | 'air' | 'sea';
  routeCost: number;
  fuelCost: number;
  tollCost: number;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'on-demand';
  activeTrips: number;
  avgDelay: number; // in minutes
  reliability: number; // percentage
  status: 'active' | 'inactive' | 'under-review';
  lastUsed: string;
  createdDate: string;
}

export default function RoutePlanningPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [routes, setRoutes] = useState<RouteDetails[]>([
    {
      id: 1,
      routeCode: 'RT-MUM-DEL-001',
      routeName: 'Mumbai to Delhi - NH48',
      origin: 'Mumbai Warehouse',
      destination: 'Delhi Distribution Center',
      waypoints: ['Vadodara Hub', 'Udaipur Transit', 'Jaipur Hub'],
      distance: 1425,
      estimatedTime: 24,
      routeType: 'primary',
      transportMode: 'road',
      routeCost: 45000,
      fuelCost: 35000,
      tollCost: 8000,
      frequency: 'daily',
      activeTrips: 12,
      avgDelay: 45,
      reliability: 94,
      status: 'active',
      lastUsed: '2024-10-21',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      routeCode: 'RT-BLR-CHN-001',
      routeName: 'Bangalore to Chennai - NH44',
      origin: 'Bangalore Plant',
      destination: 'Chennai Port',
      waypoints: ['Krishnagiri Transit'],
      distance: 350,
      estimatedTime: 7,
      routeType: 'primary',
      transportMode: 'road',
      routeCost: 12000,
      fuelCost: 9000,
      tollCost: 2500,
      frequency: 'weekly',
      activeTrips: 5,
      avgDelay: 15,
      reliability: 98,
      status: 'active',
      lastUsed: '2024-10-20',
      createdDate: '2024-02-01'
    },
    {
      id: 3,
      routeCode: 'RT-KOL-MUM-001',
      routeName: 'Kolkata to Mumbai - NH16/NH44',
      origin: 'Kolkata Depot',
      destination: 'Mumbai Warehouse',
      waypoints: ['Bhubaneswar Hub', 'Visakhapatnam Transit', 'Hyderabad Hub', 'Pune Hub'],
      distance: 2050,
      estimatedTime: 36,
      routeType: 'primary',
      transportMode: 'road',
      routeCost: 68000,
      fuelCost: 52000,
      tollCost: 12000,
      frequency: 'bi-weekly',
      activeTrips: 3,
      avgDelay: 65,
      reliability: 89,
      status: 'active',
      lastUsed: '2024-10-19',
      createdDate: '2024-01-20'
    },
    {
      id: 4,
      routeCode: 'RT-MUM-DEL-002',
      routeName: 'Mumbai to Delhi - Alternate (NH48/NH62)',
      origin: 'Mumbai Warehouse',
      destination: 'Delhi Distribution Center',
      waypoints: ['Nashik Hub', 'Indore Transit', 'Gwalior Hub', 'Agra Hub'],
      distance: 1520,
      estimatedTime: 26,
      routeType: 'alternate',
      transportMode: 'road',
      routeCost: 48000,
      fuelCost: 38000,
      tollCost: 7500,
      frequency: 'on-demand',
      activeTrips: 2,
      avgDelay: 30,
      reliability: 92,
      status: 'active',
      lastUsed: '2024-10-18',
      createdDate: '2024-03-10'
    },
    {
      id: 5,
      routeCode: 'RT-HYD-BLR-001',
      routeName: 'Hyderabad to Bangalore - NH44',
      origin: 'Hyderabad Factory',
      destination: 'Bangalore Plant',
      waypoints: ['Kurnool Transit'],
      distance: 575,
      estimatedTime: 10,
      routeType: 'primary',
      transportMode: 'road',
      routeCost: 18000,
      fuelCost: 14000,
      tollCost: 3000,
      frequency: 'weekly',
      activeTrips: 4,
      avgDelay: 20,
      reliability: 96,
      status: 'active',
      lastUsed: '2024-10-21',
      createdDate: '2024-02-15'
    },
    {
      id: 6,
      routeCode: 'RT-PUN-GOA-001',
      routeName: 'Pune to Goa - NH48',
      origin: 'Pune Hub',
      destination: 'Goa Distribution',
      waypoints: ['Kolhapur Transit'],
      distance: 485,
      estimatedTime: 9,
      routeType: 'primary',
      transportMode: 'road',
      routeCost: 16000,
      fuelCost: 12000,
      tollCost: 3200,
      frequency: 'monthly',
      activeTrips: 1,
      avgDelay: 10,
      reliability: 97,
      status: 'active',
      lastUsed: '2024-10-15',
      createdDate: '2024-04-05'
    },
    {
      id: 7,
      routeCode: 'RT-DEL-JAM-001',
      routeName: 'Delhi to Jammu - NH44',
      origin: 'Delhi Distribution Center',
      destination: 'Jammu Depot',
      waypoints: ['Ambala Transit', 'Ludhiana Hub'],
      distance: 585,
      estimatedTime: 11,
      routeType: 'primary',
      transportMode: 'road',
      routeCost: 19000,
      fuelCost: 15000,
      tollCost: 3500,
      frequency: 'bi-weekly',
      activeTrips: 2,
      avgDelay: 40,
      reliability: 88,
      status: 'active',
      lastUsed: '2024-10-17',
      createdDate: '2024-03-20'
    },
    {
      id: 8,
      routeCode: 'RT-CHN-KOC-001',
      routeName: 'Chennai to Kochi - NH66',
      origin: 'Chennai Port',
      destination: 'Kochi Depot',
      waypoints: ['Salem Transit', 'Coimbatore Hub'],
      distance: 695,
      estimatedTime: 12,
      routeType: 'primary',
      transportMode: 'road',
      routeCost: 22000,
      fuelCost: 17000,
      tollCost: 4000,
      frequency: 'weekly',
      activeTrips: 3,
      avgDelay: 25,
      reliability: 95,
      status: 'active',
      lastUsed: '2024-10-20',
      createdDate: '2024-02-28'
    },
    {
      id: 9,
      routeCode: 'RT-MUM-DEL-003',
      routeName: 'Mumbai to Delhi - Emergency (Air)',
      origin: 'Mumbai Airport',
      destination: 'Delhi Airport',
      waypoints: [],
      distance: 1150,
      estimatedTime: 2.5,
      routeType: 'emergency',
      transportMode: 'air',
      routeCost: 250000,
      fuelCost: 200000,
      tollCost: 0,
      frequency: 'on-demand',
      activeTrips: 0,
      avgDelay: 5,
      reliability: 99,
      status: 'inactive',
      lastUsed: '2024-09-15',
      createdDate: '2024-05-10'
    },
    {
      id: 10,
      routeCode: 'RT-AHM-MUM-001',
      routeName: 'Ahmedabad to Mumbai - NH48',
      origin: 'Ahmedabad Factory',
      destination: 'Mumbai Warehouse',
      waypoints: ['Vadodara Hub', 'Surat Transit'],
      distance: 535,
      estimatedTime: 9,
      routeType: 'primary',
      transportMode: 'road',
      routeCost: 17000,
      fuelCost: 13000,
      tollCost: 3500,
      frequency: 'daily',
      activeTrips: 6,
      avgDelay: 18,
      reliability: 97,
      status: 'active',
      lastUsed: '2024-10-21',
      createdDate: '2024-01-25'
    }
  ]);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'primary': 'text-blue-600 bg-blue-50 border-blue-200',
      'alternate': 'text-orange-600 bg-orange-50 border-orange-200',
      'emergency': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getModeColor = (mode: string) => {
    const colors: { [key: string]: string } = {
      'road': 'text-green-600 bg-green-50 border-green-200',
      'rail': 'text-purple-600 bg-purple-50 border-purple-200',
      'air': 'text-blue-600 bg-blue-50 border-blue-200',
      'sea': 'text-teal-600 bg-teal-50 border-teal-200'
    };
    return colors[mode] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'under-review':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 95) return 'text-green-600';
    if (reliability >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const activeRoutes = routes.filter(r => r.status === 'active').length;
  const totalActiveTrips = routes.filter(r => r.status === 'active').reduce((sum, r) => sum + r.activeTrips, 0);
  const avgReliability = (routes.filter(r => r.status === 'active').reduce((sum, r) => sum + r.reliability, 0) / activeRoutes).toFixed(1);
  const totalDistance = routes.filter(r => r.status === 'active').reduce((sum, r) => sum + r.distance, 0);

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.routeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || route.routeType === selectedType;
    const matchesMode = selectedMode === 'all' || route.transportMode === selectedMode;
    const matchesStatus = selectedStatus === 'all' || route.status === selectedStatus;
    return matchesSearch && matchesType && matchesMode && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Route className="w-8 h-8 text-blue-600" />
            <span>Route Planning</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage transportation routes and optimize delivery paths</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Route</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Route className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{activeRoutes}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Active Routes</div>
          <div className="text-xs text-blue-600 mt-1">In Operation</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{totalActiveTrips}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Active Trips</div>
          <div className="text-xs text-green-600 mt-1">In Transit</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{avgReliability}%</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Avg Reliability</div>
          <div className="text-xs text-purple-600 mt-1">On-Time Performance</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Navigation className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{totalDistance.toLocaleString()}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Total Network</div>
          <div className="text-xs text-orange-600 mt-1">Kilometers</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Route Types</option>
            <option value="primary">Primary Routes</option>
            <option value="alternate">Alternate Routes</option>
            <option value="emergency">Emergency Routes</option>
          </select>

          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Transport Modes</option>
            <option value="road">Road</option>
            <option value="rail">Rail</option>
            <option value="air">Air</option>
            <option value="sea">Sea</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="under-review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin → Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Trips</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reliability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{route.routeCode}</div>
                    <div className="text-sm text-gray-600">{route.routeName}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {route.waypoints.length > 0 && `Via: ${route.waypoints.slice(0, 2).join(', ')}${route.waypoints.length > 2 ? '...' : ''}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="text-gray-900">{route.origin}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm mt-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-gray-900">{route.destination}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(route.routeType)}`}>
                      {route.routeType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getModeColor(route.transportMode)}`}>
                      {route.transportMode.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {route.distance.toLocaleString()} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{route.estimatedTime}h</span>
                    </div>
                    {route.avgDelay > 0 && (
                      <div className="text-xs text-orange-600 flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>+{route.avgDelay}m avg delay</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>₹{(route.routeCost / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Fuel: ₹{(route.fuelCost / 1000).toFixed(1)}K | Toll: ₹{(route.tollCost / 1000).toFixed(1)}K
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900">{route.activeTrips}</span>
                    </div>
                    <div className="text-xs text-gray-500">{route.frequency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                        <div
                          className={`h-2 rounded-full ${
                            route.reliability >= 95 ? 'bg-green-500' :
                            route.reliability >= 90 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${route.reliability}%` }}
                        />
                      </div>
                      <span className={`font-bold ${getReliabilityColor(route.reliability)}`}>
                        {route.reliability}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(route.status)}`}>
                      {route.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Performance Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Route className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Route Optimization</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Use AI-powered route planning to minimize distance, fuel costs, and delivery time.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Primary routes for regular shipments</div>
            <div>• Alternate routes for contingency</div>
            <div>• Emergency routes for urgent deliveries</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Performance Tracking</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Monitor route reliability, average delays, and on-time delivery performance.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Reliability: % of on-time deliveries</div>
            <div>• Avg Delay: Minutes behind schedule</div>
            <div>• Active Trips: Current shipments in transit</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Cost Analysis</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Track total route costs including fuel, tolls, driver wages, and vehicle maintenance.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Fuel Cost: Major expense component</div>
            <div>• Toll Cost: Highway and bridge fees</div>
            <div>• Total Cost: Per trip or per kilometer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
