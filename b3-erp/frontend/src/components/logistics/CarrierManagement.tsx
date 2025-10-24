'use client';

import React from 'react';
import { Truck, Star, TrendingUp, DollarSign, Clock, Package } from 'lucide-react';

export default function CarrierManagement() {
  const carriers = [
    { id: 'CAR-001', name: 'Blue Dart Express', rating: 4.8, onTimePerf: 96, totalShipments: 850, avgCost: 450, status: 'active' },
    { id: 'CAR-002', name: 'DTDC Courier', rating: 4.5, onTimePerf: 92, totalShipments: 620, avgCost: 380, status: 'active' },
    { id: 'CAR-003', name: 'Delhivery Logistics', rating: 4.6, onTimePerf: 94, totalShipments: 720, avgCost: 420, status: 'active' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrier Management System</h1>
          <p className="text-gray-600">Manage carrier partnerships and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active Carriers</p>
            <p className="text-3xl font-bold text-indigo-600">{carriers.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Avg On-Time %</p>
            <p className="text-3xl font-bold text-green-600">94.2%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Total Shipments</p>
            <p className="text-3xl font-bold text-purple-600">2,190</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Avg Cost/Shipment</p>
            <p className="text-3xl font-bold text-orange-600">₹417</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Carrier Performance</h2>

          <div className="space-y-4">
            {carriers.map((carrier) => (
              <div key={carrier.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{carrier.name}</h3>
                      <p className="text-sm text-gray-600">Carrier ID: {carrier.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Star className="w-5 h-5 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{carrier.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      On-Time Performance
                    </p>
                    <p className="text-lg font-bold text-green-600">{carrier.onTimePerf}%</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      Total Shipments
                    </p>
                    <p className="text-lg font-bold text-gray-900">{carrier.totalShipments}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Avg Cost
                    </p>
                    <p className="text-lg font-bold text-orange-600">₹{carrier.avgCost}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {carrier.status.toUpperCase()}
                    </span>
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
