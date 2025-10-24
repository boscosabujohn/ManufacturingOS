'use client';

import React, { useState } from 'react';
import { MapPin, Truck, Navigation, Clock, Thermometer, Fuel, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

export type ShipmentStatus = 'in-transit' | 'loading' | 'unloading' | 'delivered' | 'delayed' | 'exception';
export type VehicleStatus = 'active' | 'idle' | 'maintenance' | 'offline';

export interface LiveShipment {
  id: string;
  shipmentNumber: string;
  vehicle: string;
  driver: string;
  origin: string;
  destination: string;
  currentLocation: { lat: number; lng: number; address: string };
  status: ShipmentStatus;
  progress: number;
  eta: string;
  distanceRemaining: number;
  speed: number;
  temperature?: number;
  fuel?: number;
  stops: { location: string; status: 'pending' | 'completed'; time?: string }[];
}

export interface VehicleTelemetry {
  vehicleId: string;
  vehicleNumber: string;
  status: VehicleStatus;
  location: { lat: number; lng: number; address: string };
  speed: number;
  fuel: number;
  temperature?: number;
  engineHours: number;
  odometer: number;
  lastUpdate: string;
}

export default function LiveTelematicsTracking() {
  const [activeView, setActiveView] = useState<'map' | 'list' | 'metrics'>('list');

  const liveShipments: LiveShipment[] = [
    {
      id: 'SHP-001',
      shipmentNumber: 'SH-2025-0124',
      vehicle: 'MH-12-AB-1234',
      driver: 'Rajesh Kumar',
      origin: 'Mumbai Warehouse',
      destination: 'Delhi Hub',
      currentLocation: { lat: 21.1458, lng: 79.0882, address: 'Near Nagpur, Maharashtra' },
      status: 'in-transit',
      progress: 65,
      eta: '2025-01-25 08:30',
      distanceRemaining: 520,
      speed: 65,
      temperature: 22,
      fuel: 68,
      stops: [
        { location: 'Mumbai Warehouse', status: 'completed', time: '2025-01-24 06:00' },
        { location: 'Nashik Checkpoint', status: 'completed', time: '2025-01-24 10:15' },
        { location: 'Nagpur Rest Stop', status: 'pending' },
        { location: 'Delhi Hub', status: 'pending' },
      ],
    },
    {
      id: 'SHP-002',
      shipmentNumber: 'SH-2025-0125',
      vehicle: 'KA-01-CD-5678',
      driver: 'Amit Singh',
      origin: 'Bangalore Plant',
      destination: 'Hyderabad Distribution',
      currentLocation: { lat: 13.0827, lng: 80.2707, address: 'Chennai Outer Ring Road' },
      status: 'delayed',
      progress: 45,
      eta: '2025-01-24 20:00',
      distanceRemaining: 280,
      speed: 0,
      fuel: 45,
      stops: [
        { location: 'Bangalore Plant', status: 'completed', time: '2025-01-24 08:00' },
        { location: 'Chennai Transit', status: 'completed', time: '2025-01-24 14:30' },
        { location: 'Hyderabad Distribution', status: 'pending' },
      ],
    },
  ];

  const vehicleTelemetry: VehicleTelemetry[] = [
    {
      vehicleId: 'VEH-001',
      vehicleNumber: 'MH-12-AB-1234',
      status: 'active',
      location: { lat: 21.1458, lng: 79.0882, address: 'Near Nagpur' },
      speed: 65,
      fuel: 68,
      temperature: 22,
      engineHours: 2450,
      odometer: 145230,
      lastUpdate: '2 mins ago',
    },
    {
      vehicleId: 'VEH-002',
      vehicleNumber: 'KA-01-CD-5678',
      status: 'idle',
      location: { lat: 13.0827, lng: 80.2707, address: 'Chennai Outer Ring Road' },
      speed: 0,
      fuel: 45,
      engineHours: 1820,
      odometer: 98540,
      lastUpdate: '15 mins ago',
    },
  ];

  const getStatusColor = (status: ShipmentStatus | VehicleStatus) => {
    switch (status) {
      case 'in-transit':
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'loading':
      case 'unloading':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'delayed':
      case 'exception':
        return 'bg-red-100 text-red-800';
      case 'idle':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Telematics & GPS Tracking</h1>
          <p className="text-gray-600">Real-time vehicle and shipment monitoring</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">Active Shipments</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{liveShipments.filter(s => s.status === 'in-transit').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">On-Time Delivery</p>
            </div>
            <p className="text-3xl font-bold text-green-600">94.5%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-gray-600">Delayed</p>
            </div>
            <p className="text-3xl font-bold text-red-600">{liveShipments.filter(s => s.status === 'delayed').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-gray-600">Active Vehicles</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">{vehicleTelemetry.filter(v => v.status === 'active').length}</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex">
            {['list', 'map', 'metrics'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view as any)}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeView === view
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)} View
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {activeView === 'list' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Shipments</h2>
              {liveShipments.map((shipment) => (
                <div key={shipment.id} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{shipment.shipmentNumber}</h3>
                        <p className="text-sm text-gray-600">{shipment.vehicle} • {shipment.driver}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                      {shipment.status.toUpperCase().replace('-', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600">Current Location</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        {shipment.currentLocation.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">ETA</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-green-600" />
                        {shipment.eta}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Distance Remaining</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Navigation className="w-4 h-4 text-purple-600" />
                        {shipment.distanceRemaining} km
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Current Speed</p>
                      <p className="font-semibold text-gray-900">{shipment.speed} km/h</p>
                    </div>
                  </div>

                  {shipment.temperature !== undefined && shipment.fuel !== undefined && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <Thermometer className="w-4 h-4" />
                          Temperature
                        </p>
                        <p className="text-lg font-bold text-gray-900">{shipment.temperature}°C</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <Fuel className="w-4 h-4" />
                          Fuel Level
                        </p>
                        <p className="text-lg font-bold text-gray-900">{shipment.fuel}%</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Progress: {shipment.progress}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${shipment.progress}%` }}></div>
                    </div>

                    <div className="flex items-center gap-2">
                      {shipment.stops.map((stop, idx) => (
                        <React.Fragment key={idx}>
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                            stop.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {stop.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                            {stop.location}
                          </div>
                          {idx < shipment.stops.length - 1 && <div className="w-4 h-0.5 bg-gray-300"></div>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeView === 'map' && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Map View</h3>
              <p className="text-gray-600 mb-4">Integrate with Google Maps / Mapbox for real-time vehicle tracking</p>
              <div className="bg-gray-100 rounded-lg p-8 border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Map Integration Placeholder</p>
                <p className="text-sm text-gray-400 mt-2">GPS coordinates: {liveShipments[0].currentLocation.lat}, {liveShipments[0].currentLocation.lng}</p>
              </div>
            </div>
          )}

          {activeView === 'metrics' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Telemetry</h2>
              {vehicleTelemetry.map((vehicle) => (
                <div key={vehicle.vehicleId} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{vehicle.vehicleNumber}</h3>
                      <p className="text-sm text-gray-600">Last updated: {vehicle.lastUpdate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Speed</p>
                      <p className="text-lg font-bold text-gray-900">{vehicle.speed} km/h</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Fuel</p>
                      <p className="text-lg font-bold text-gray-900">{vehicle.fuel}%</p>
                    </div>
                    {vehicle.temperature && (
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Temp</p>
                        <p className="text-lg font-bold text-gray-900">{vehicle.temperature}°C</p>
                      </div>
                    )}
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Engine Hours</p>
                      <p className="text-lg font-bold text-gray-900">{vehicle.engineHours}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Odometer</p>
                      <p className="text-lg font-bold text-gray-900">{vehicle.odometer.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
