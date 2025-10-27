'use client';

import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Edit2,
  Eye,
  Search,
  MapPin,
  Navigation,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Fuel,
  Settings
} from 'lucide-react';

interface VehicleTracking {
  id: number;
  vehicleId: string;
  vehicleNumber: string;
  vehicleType: string;
  make: string;
  model: string;
  year: number;
  currentLocation: string;
  latitude: number;
  longitude: number;
  currentStatus: 'active' | 'idle' | 'maintenance' | 'offline' | 'in-transit';
  driverName: string;
  driverPhone: string;
  currentTrip: string | null;
  currentLoad: string | null;
  speed: number; // km/h
  fuelLevel: number; // percentage
  odometer: number; // km
  lastUpdated: string;
  destination: string | null;
  eta: string | null;
  distanceRemaining: number | null; // km
  engineStatus: 'on' | 'off';
  gpsStatus: 'active' | 'weak' | 'lost';
  alertCount: number;
  nextMaintenance: string;
  nextMaintenanceKm: number;
}

export default function FleetTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const [vehicles, setVehicles] = useState<VehicleTracking[]>([
    {
      id: 1,
      vehicleId: 'VEH-001',
      vehicleNumber: 'MH-01-AB-1234',
      vehicleType: '32-Ft Truck',
      make: 'Tata',
      model: 'LPT 3118',
      year: 2022,
      currentLocation: 'Vadodara Hub, Gujarat',
      latitude: 22.3072,
      longitude: 73.1812,
      currentStatus: 'in-transit',
      driverName: 'Ramesh Sharma',
      driverPhone: '+91-9876543210',
      currentTrip: 'TRP-2024-001',
      currentLoad: 'LD-2024-001',
      speed: 65,
      fuelLevel: 72,
      odometer: 125680,
      lastUpdated: '2024-10-21 14:30',
      destination: 'Delhi Distribution Center',
      eta: '2024-10-23 18:00',
      distanceRemaining: 850,
      engineStatus: 'on',
      gpsStatus: 'active',
      alertCount: 0,
      nextMaintenance: '2024-11-15',
      nextMaintenanceKm: 130000
    },
    {
      id: 2,
      vehicleId: 'VEH-002',
      vehicleNumber: 'KA-05-CD-5678',
      vehicleType: '20-Ft Container',
      make: 'Ashok Leyland',
      model: 'Ecomet 1615',
      year: 2023,
      currentLocation: 'Bangalore Plant, Karnataka',
      latitude: 12.9716,
      longitude: 77.5946,
      currentStatus: 'idle',
      driverName: 'Suresh Kumar',
      driverPhone: '+91-9876543211',
      currentTrip: null,
      currentLoad: null,
      speed: 0,
      fuelLevel: 85,
      odometer: 89450,
      lastUpdated: '2024-10-21 14:25',
      destination: null,
      eta: null,
      distanceRemaining: null,
      engineStatus: 'off',
      gpsStatus: 'active',
      alertCount: 0,
      nextMaintenance: '2024-10-28',
      nextMaintenanceKm: 90000
    },
    {
      id: 3,
      vehicleId: 'VEH-003',
      vehicleNumber: 'WB-02-EF-9012',
      vehicleType: '40-Ft Truck',
      make: 'Mahindra',
      model: 'Blazo X 42',
      year: 2021,
      currentLocation: 'Bhubaneswar Hub, Odisha',
      latitude: 20.2961,
      longitude: 85.8245,
      currentStatus: 'in-transit',
      driverName: 'Mohan Das',
      driverPhone: '+91-9876543212',
      currentTrip: 'TRP-2024-003',
      currentLoad: 'LD-2024-003',
      speed: 58,
      fuelLevel: 45,
      distanceRemaining: 1500,
      odometer: 215680,
      lastUpdated: '2024-10-21 14:28',
      destination: 'Mumbai Warehouse',
      eta: '2024-10-23 18:00',
      engineStatus: 'on',
      gpsStatus: 'active',
      alertCount: 1,
      nextMaintenance: '2024-11-05',
      nextMaintenanceKm: 220000
    },
    {
      id: 4,
      vehicleId: 'VEH-004',
      vehicleNumber: 'TS-09-GH-3456',
      vehicleType: '24-Ft Truck',
      make: 'BharatBenz',
      model: '2826R',
      year: 2023,
      currentLocation: 'Hyderabad Workshop, Telangana',
      latitude: 17.3850,
      longitude: 78.4867,
      currentStatus: 'maintenance',
      driverName: 'Prakash Reddy',
      driverPhone: '+91-9876543213',
      currentTrip: null,
      currentLoad: null,
      speed: 0,
      fuelLevel: 30,
      odometer: 145280,
      lastUpdated: '2024-10-21 09:00',
      destination: null,
      eta: null,
      distanceRemaining: null,
      engineStatus: 'off',
      gpsStatus: 'active',
      alertCount: 2,
      nextMaintenance: '2024-10-21',
      nextMaintenanceKm: 145000
    },
    {
      id: 5,
      vehicleId: 'VEH-005',
      vehicleNumber: 'MH-12-IJ-7890',
      vehicleType: '18-Ft Truck',
      make: 'Eicher',
      model: 'Pro 6025T',
      year: 2022,
      currentLocation: 'Pune Hub, Maharashtra',
      latitude: 18.5204,
      longitude: 73.8567,
      currentStatus: 'idle',
      driverName: 'Ganesh Patil',
      driverPhone: '+91-9876543214',
      currentTrip: null,
      currentLoad: null,
      speed: 0,
      fuelLevel: 90,
      odometer: 98750,
      lastUpdated: '2024-10-21 14:20',
      destination: null,
      eta: null,
      distanceRemaining: null,
      engineStatus: 'off',
      gpsStatus: 'active',
      alertCount: 0,
      nextMaintenance: '2024-11-20',
      nextMaintenanceKm: 105000
    },
    {
      id: 6,
      vehicleId: 'VEH-006',
      vehicleNumber: 'DL-03-KL-2468',
      vehicleType: '28-Ft Truck',
      make: 'Tata',
      model: 'Signa 2823.K',
      year: 2021,
      currentLocation: 'Ambala Transit, Haryana',
      latitude: 30.3782,
      longitude: 76.7821,
      currentStatus: 'in-transit',
      driverName: 'Vijay Singh',
      driverPhone: '+91-9876543215',
      currentTrip: 'TRP-2024-006',
      currentLoad: 'LD-2024-006',
      speed: 70,
      fuelLevel: 65,
      odometer: 178920,
      lastUpdated: '2024-10-21 14:32',
      destination: 'Jammu Depot',
      eta: '2024-10-23 09:00',
      distanceRemaining: 320,
      engineStatus: 'on',
      gpsStatus: 'active',
      alertCount: 0,
      nextMaintenance: '2024-12-10',
      nextMaintenanceKm: 185000
    },
    {
      id: 7,
      vehicleId: 'VEH-007',
      vehicleNumber: 'TN-01-MN-1357',
      vehicleType: '32-Ft Truck',
      make: 'Volvo',
      model: 'FH16',
      year: 2023,
      currentLocation: 'Chennai Port, Tamil Nadu',
      latitude: 13.0827,
      longitude: 80.2707,
      currentStatus: 'idle',
      driverName: 'Murugan Subramanian',
      driverPhone: '+91-9876543216',
      currentTrip: null,
      currentLoad: null,
      speed: 0,
      fuelLevel: 78,
      odometer: 156890,
      lastUpdated: '2024-10-21 14:15',
      destination: null,
      eta: null,
      distanceRemaining: null,
      engineStatus: 'off',
      gpsStatus: 'active',
      alertCount: 0,
      nextMaintenance: '2024-11-30',
      nextMaintenanceKm: 165000
    },
    {
      id: 8,
      vehicleId: 'VEH-008',
      vehicleNumber: 'GJ-01-OP-2580',
      vehicleType: '20-Ft Truck',
      make: 'Ashok Leyland',
      model: 'Partner',
      year: 2020,
      currentLocation: 'Unknown',
      latitude: 0,
      longitude: 0,
      currentStatus: 'offline',
      driverName: 'Bharat Patel',
      driverPhone: '+91-9876543217',
      currentTrip: null,
      currentLoad: null,
      speed: 0,
      fuelLevel: 0,
      odometer: 134560,
      lastUpdated: '2024-10-21 10:45',
      destination: null,
      eta: null,
      distanceRemaining: null,
      engineStatus: 'off',
      gpsStatus: 'lost',
      alertCount: 3,
      nextMaintenance: '2024-10-25',
      nextMaintenanceKm: 135000
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'text-green-600 bg-green-50 border-green-200',
      'idle': 'text-blue-600 bg-blue-50 border-blue-200',
      'maintenance': 'text-orange-600 bg-orange-50 border-orange-200',
      'offline': 'text-red-600 bg-red-50 border-red-200',
      'in-transit': 'text-purple-600 bg-purple-50 border-purple-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-transit':
        return <Navigation className="w-4 h-4 text-purple-500" />;
      case 'idle':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'maintenance':
        return <Settings className="w-4 h-4 text-orange-500" />;
      case 'offline':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getFuelColor = (fuelLevel: number) => {
    if (fuelLevel >= 60) return 'text-green-600';
    if (fuelLevel >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGpsStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'weak':
        return 'text-yellow-600';
      case 'lost':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.currentStatus === 'active' || v.currentStatus === 'in-transit').length;
  const idleVehicles = vehicles.filter(v => v.currentStatus === 'idle').length;
  const maintenanceVehicles = vehicles.filter(v => v.currentStatus === 'maintenance').length;

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.currentLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || vehicle.currentStatus === selectedStatus;
    const matchesType = selectedType === 'all' || vehicle.vehicleType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Truck className="w-8 h-8 text-blue-600" />
            <span>Fleet Tracking</span>
          </h1>
          <p className="text-gray-600 mt-1">Real-time vehicle location and status monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{totalVehicles}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Total Fleet</div>
          <div className="text-xs text-blue-600 mt-1">All Vehicles</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Navigation className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{activeVehicles}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Active/In-Transit</div>
          <div className="text-xs text-green-600 mt-1">Currently Moving</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-900">{idleVehicles}</span>
          </div>
          <div className="text-sm font-medium text-yellow-700">Idle Vehicles</div>
          <div className="text-xs text-yellow-600 mt-1">Available</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Settings className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{maintenanceVehicles}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">In Maintenance</div>
          <div className="text-xs text-orange-600 mt-1">Under Service</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="in-transit">In-Transit</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Vehicle Types</option>
            <option value="18-Ft Truck">18-Ft Truck</option>
            <option value="20-Ft Container">20-Ft Container</option>
            <option value="24-Ft Truck">24-Ft Truck</option>
            <option value="28-Ft Truck">28-Ft Truck</option>
            <option value="32-Ft Truck">32-Ft Truck</option>
            <option value="40-Ft Truck">40-Ft Truck</option>
          </select>
        </div>
      </div>

      {/* Vehicle Tracking Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPS Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{vehicle.vehicleNumber}</div>
                    <div className="text-sm text-gray-600">{vehicle.vehicleType}</div>
                    <div className="text-xs text-gray-500 mt-1">{vehicle.make} {vehicle.model} ({vehicle.year})</div>
                    <div className="text-xs text-gray-500">ODO: {vehicle.odometer.toLocaleString()} km</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{vehicle.driverName}</div>
                    <div className="text-xs text-gray-500">{vehicle.driverPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{vehicle.currentLocation}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last Updated: {new Date(vehicle.lastUpdated).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {vehicle.currentTrip ? (
                      <>
                        <div className="text-sm text-gray-900">Trip: {vehicle.currentTrip}</div>
                        <div className="text-xs text-gray-600 mt-1">Load: {vehicle.currentLoad}</div>
                        {vehicle.destination && (
                          <>
                            <div className="text-xs text-gray-500 mt-1">→ {vehicle.destination}</div>
                            <div className="text-xs text-blue-600">ETA: {vehicle.eta && new Date(vehicle.eta).toLocaleString()}</div>
                            {vehicle.distanceRemaining && (
                              <div className="text-xs text-gray-500">{vehicle.distanceRemaining} km remaining</div>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">No active trip</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-bold text-gray-900">{vehicle.speed}</div>
                    <div className="text-xs text-gray-500">km/h</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Fuel className={`w-4 h-4 ${getFuelColor(vehicle.fuelLevel)}`} />
                      <div>
                        <div className={`text-sm font-bold ${getFuelColor(vehicle.fuelLevel)}`}>
                          {vehicle.fuelLevel}%
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-16 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              vehicle.fuelLevel >= 60 ? 'bg-green-500' :
                              vehicle.fuelLevel >= 30 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${vehicle.fuelLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className={`text-sm font-medium ${getGpsStatusColor(vehicle.gpsStatus)}`}>
                      {vehicle.gpsStatus.toUpperCase()}
                    </div>
                    {vehicle.alertCount > 0 && (
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-600">{vehicle.alertCount} alerts</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(vehicle.currentStatus)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(vehicle.currentStatus)}`}>
                        {vehicle.currentStatus.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
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

      {/* Fleet Tracking Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Real-Time Tracking</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Monitor vehicle locations, speed, and trip progress with GPS-enabled tracking.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Live GPS location updates</div>
            <div>• Speed and odometer monitoring</div>
            <div>• Trip and destination tracking</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Fuel className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Fuel Monitoring</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Track fuel levels in real-time with automatic alerts for low fuel conditions.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Real-time fuel level tracking</div>
            <div>• Low fuel alerts and warnings</div>
            <div>• Fuel consumption analytics</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Alert Management</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Receive instant alerts for GPS issues, maintenance due, and vehicle anomalies.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• GPS signal loss alerts</div>
            <div>• Maintenance reminders</div>
            <div>• Speed and geofence violations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
