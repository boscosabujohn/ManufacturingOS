'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, MapPin, Truck, Package, Clock, CheckCircle, Navigation } from 'lucide-react';

interface TrackingEvent {
  timestamp: string;
  location: string;
  status: string;
  description: string;
  icon: 'checkpoint' | 'loading' | 'transit' | 'delivery';
}

interface ShipmentTrace {
  shipmentNo: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  currentLocation: string;
  status: 'in-transit' | 'delivered' | 'pending' | 'delayed';
  estimatedDelivery: string;
  vehicleNo: string;
  driverName: string;
  events: TrackingEvent[];
}

export default function TraceTrackingPage() {
  const router = useRouter();
  const [trackingQuery, setTrackingQuery] = useState('');
  const [shipmentTrace, setShipmentTrace] = useState<ShipmentTrace | null>(null);

  const sampleTraces: { [key: string]: ShipmentTrace } = {
    'TRK-CHN-2025-4521': {
      shipmentNo: 'OB-2025-0531',
      trackingNumber: 'TRK-CHN-2025-4521',
      origin: 'Chennai Warehouse A',
      destination: 'Bangalore, Karnataka',
      currentLocation: 'Vellore Transit Hub',
      status: 'in-transit',
      estimatedDelivery: '2025-10-23 16:00',
      vehicleNo: 'TN-01-AB-1234',
      driverName: 'Rajesh Kumar',
      events: [
        {
          timestamp: '2025-10-21 08:30',
          location: 'Chennai Warehouse A',
          status: 'Picked Up',
          description: 'Shipment picked up and loaded',
          icon: 'loading'
        },
        {
          timestamp: '2025-10-21 09:15',
          location: 'Chennai Checkpoint',
          status: 'In Transit',
          description: 'Left Chennai facility',
          icon: 'checkpoint'
        },
        {
          timestamp: '2025-10-21 12:45',
          location: 'Vellore Transit Hub',
          status: 'In Transit',
          description: 'Arrived at transit hub',
          icon: 'transit'
        },
        {
          timestamp: '2025-10-21 14:30',
          location: 'Vellore Transit Hub',
          status: 'In Transit',
          description: 'Vehicle refueling and driver break',
          icon: 'checkpoint'
        },
        {
          timestamp: '2025-10-21 15:00',
          location: 'Vellore Transit Hub',
          status: 'In Transit',
          description: 'Departed from transit hub',
          icon: 'transit'
        }
      ]
    },
    'TRK-CHN-2025-4524': {
      shipmentNo: 'OB-2025-0534',
      trackingNumber: 'TRK-CHN-2025-4524',
      origin: 'Chennai Warehouse A',
      destination: 'Pune, Maharashtra',
      currentLocation: 'Pune Distribution Center',
      status: 'delivered',
      estimatedDelivery: '2025-10-23 14:00',
      vehicleNo: 'TN-04-GH-3456',
      driverName: 'Vijay Singh',
      events: [
        {
          timestamp: '2025-10-21 07:00',
          location: 'Chennai Warehouse A',
          status: 'Picked Up',
          description: 'Shipment picked up and loaded',
          icon: 'loading'
        },
        {
          timestamp: '2025-10-21 07:45',
          location: 'Chennai Checkpoint',
          status: 'In Transit',
          description: 'Left Chennai facility',
          icon: 'checkpoint'
        },
        {
          timestamp: '2025-10-21 19:30',
          location: 'Bangalore Transit Hub',
          status: 'In Transit',
          description: 'Night halt at transit hub',
          icon: 'transit'
        },
        {
          timestamp: '2025-10-22 08:00',
          location: 'Bangalore Transit Hub',
          status: 'In Transit',
          description: 'Resumed journey',
          icon: 'transit'
        },
        {
          timestamp: '2025-10-22 18:45',
          location: 'Mumbai Transit Hub',
          status: 'In Transit',
          description: 'Night halt at transit hub',
          icon: 'transit'
        },
        {
          timestamp: '2025-10-23 09:00',
          location: 'Mumbai Transit Hub',
          status: 'In Transit',
          description: 'Departed for final destination',
          icon: 'transit'
        },
        {
          timestamp: '2025-10-23 13:30',
          location: 'Pune Distribution Center',
          status: 'Out for Delivery',
          description: 'Arrived at distribution center',
          icon: 'checkpoint'
        },
        {
          timestamp: '2025-10-23 15:45',
          location: 'Customer Location - Pune',
          status: 'Delivered',
          description: 'Shipment successfully delivered',
          icon: 'delivery'
        }
      ]
    }
  };

  const handleTrack = () => {
    const trace = sampleTraces[trackingQuery];
    if (trace) {
      setShipmentTrace(trace);
    } else {
      alert('Tracking number not found. Try: TRK-CHN-2025-4521 or TRK-CHN-2025-4524');
      setShipmentTrace(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-transit': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delayed': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEventIcon = (icon: string) => {
    switch (icon) {
      case 'loading': return <Package className="w-5 h-5 text-blue-600" />;
      case 'checkpoint': return <MapPin className="w-5 h-5 text-purple-600" />;
      case 'transit': return <Truck className="w-5 h-5 text-yellow-600" />;
      case 'delivery': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <MapPin className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trace & Track Shipment</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time shipment tracking and location updates</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Enter Tracking Number
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter tracking number (e.g., TRK-CHN-2025-4521)"
              value={trackingQuery}
              onChange={(e) => setTrackingQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
            <button
              onClick={handleTrack}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Track
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Sample tracking numbers: TRK-CHN-2025-4521, TRK-CHN-2025-4524
          </p>
        </div>

        {shipmentTrace && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{shipmentTrace.shipmentNo}</h3>
                  <p className="text-sm text-gray-500 font-mono">{shipmentTrace.trackingNumber}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(shipmentTrace.status)}`}>
                  {shipmentTrace.status.replace('-', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-blue-600 font-medium mb-1">Origin</p>
                      <p className="text-sm font-semibold text-blue-900">{shipmentTrace.origin}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-green-600 font-medium mb-1">Destination</p>
                      <p className="text-sm font-semibold text-green-900">{shipmentTrace.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-purple-600 font-medium mb-1">Current Location</p>
                      <p className="text-sm font-semibold text-purple-900">{shipmentTrace.currentLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-orange-600 font-medium mb-1">Estimated Delivery</p>
                      <p className="text-sm font-semibold text-orange-900">{shipmentTrace.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Vehicle Number</p>
                  <p className="text-sm font-mono font-semibold text-gray-900">{shipmentTrace.vehicleNo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Driver Name</p>
                  <p className="text-sm font-semibold text-gray-900">{shipmentTrace.driverName}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Tracking History</h3>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-6">
                  {shipmentTrace.events.map((event, index) => (
                    <div key={index} className="relative flex gap-4">
                      <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                        {getEventIcon(event.icon)}
                      </div>

                      <div className="flex-1 pb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{event.status}</p>
                              <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {event.timestamp}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-blue-600 mt-2">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!shipmentTrace && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Enter tracking number to trace shipment</p>
            <p className="text-sm text-gray-400">Get real-time updates on your shipment location and status</p>
          </div>
        )}
      </div>

      <div className="mt-6 max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Tracking Features:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Real-time GPS location tracking for accurate shipment visibility</li>
          <li>Complete event history from pickup to delivery</li>
          <li>Estimated delivery time based on current location and route</li>
          <li>Driver and vehicle information for direct contact</li>
          <li>Automated status updates at each checkpoint</li>
        </ul>
      </div>
    </div>
  );
}
