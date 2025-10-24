'use client';

import React from 'react';
import { Package, MapPin, Clock, Truck, CheckCircle, Eye } from 'lucide-react';

export default function CustomerVisibilityPortal() {
  const customerShipments = [
    { id: 'TRK-2025-4567', status: 'In Transit', location: 'Near Nagpur', eta: '2025-01-25 08:30', progress: 65 },
    { id: 'TRK-2025-4568', status: 'Out for Delivery', location: 'Bangalore Hub', eta: '2025-01-24 18:00', progress: 90 },
    { id: 'TRK-2025-4569', status: 'Delivered', location: 'Chennai Office', eta: 'Delivered', progress: 100 },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Visibility Portal</h1>
          <p className="text-gray-600">Self-service shipment tracking for customers</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Track Your Shipment</h2>
              <p className="text-sm text-gray-600">Enter tracking number to view real-time status</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter tracking number (e.g., TRK-2025-4567)"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
              Track
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Shipments</h2>

          <div className="space-y-4">
            {customerShipments.map((shipment) => (
              <div key={shipment.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Tracking #{shipment.id}</h3>
                      <p className="text-sm text-gray-600">{shipment.status}</p>
                    </div>
                  </div>
                  {shipment.progress === 100 ? (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      DELIVERED
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      IN TRANSIT
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    Current: {shipment.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    ETA: {shipment.eta}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Delivery Progress</span>
                    <span className="font-semibold text-gray-900">{shipment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${shipment.progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${shipment.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
