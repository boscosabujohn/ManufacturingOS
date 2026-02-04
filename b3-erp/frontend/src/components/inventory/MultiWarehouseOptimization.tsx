'use client';

import React from 'react';
import { Warehouse, TrendingUp, Package, Truck, MapPin } from 'lucide-react';

export default function MultiWarehouseOptimization() {
  const warehouses = [
    { id: 'WH-001', name: 'Main Warehouse', location: 'Mumbai', capacity: 10000, utilized: 7500, items: 850, value: 28500000 },
    { id: 'WH-002', name: 'Regional Hub - North', location: 'Delhi', capacity: 5000, utilized: 3200, items: 420, value: 12300000 },
    { id: 'WH-003', name: 'Regional Hub - South', location: 'Bangalore', capacity: 5000, utilized: 2800, items: 380, value: 9800000 },
  ];

  const transferRecommendations = [
    { from: 'Main Warehouse', to: 'Regional Hub - South', item: 'Steel Sheet 304', qty: 200, reason: 'High demand in South region' },
    { from: 'Regional Hub - North', to: 'Main Warehouse', item: 'Hydraulic Pump HP-500', qty: 15, reason: 'Excess stock rebalancing' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 p-3">
      <div className="">
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Multi-Warehouse Optimization</h1>
          <p className="text-gray-600">Intelligent stock distribution and transfer optimization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          {warehouses.map((wh) => {
            const utilization = (wh.utilized / wh.capacity) * 100;
            return (
              <div key={wh.id} className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Warehouse className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{wh.name}</h3>
                    <p className="text-sm text-gray-600">{wh.location}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Utilization</span>
                      <span className="font-semibold text-gray-900">{utilization.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${utilization > 80 ? 'bg-red-500' : utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${utilization}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Items</p>
                      <p className="font-semibold text-gray-900">{wh.items}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Value</p>
                      <p className="font-semibold text-green-600">₹{(wh.value / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Transfer Recommendations</h2>

          <div className="space-y-2">
            {transferRecommendations.map((rec, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">{rec.from}</span>
                    </div>
                    <Truck className="w-5 h-5 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-gray-900">{rec.to}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                    Create Transfer
                  </button>
                </div>
                <div className="mt-3 text-sm">
                  <p className="text-gray-900"><span className="font-semibold">Item:</span> {rec.item} • <span className="font-semibold">Qty:</span> {rec.qty}</p>
                  <p className="text-gray-600">{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
