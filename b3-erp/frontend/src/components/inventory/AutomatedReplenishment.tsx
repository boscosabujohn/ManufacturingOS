'use client';

import React from 'react';
import { RefreshCw, TrendingUp, Package, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AutomatedReplenishment() {
  const replenishmentOrders = [
    { id: 'REP-001', item: 'Steel Sheet 304 - 2mm', current: 450, min: 500, max: 2000, recommended: 1500, status: 'approved' },
    { id: 'REP-002', item: 'Hydraulic Pump HP-500', current: 25, min: 30, max: 150, recommended: 100, status: 'pending' },
    { id: 'REP-003', item: 'Bearing 6205-2RS', current: 80, min: 100, max: 500, recommended: 300, status: 'ordered' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ordered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 p-3">
      <div className="">
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Automated Replenishment System</h1>
          <p className="text-gray-600">Min-max based automatic reorder point management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          {[
            { label: 'Auto Reorders Today', value: 12, color: 'blue' },
            { label: 'Pending Approval', value: 5, color: 'yellow' },
            { label: 'Below Min Stock', value: 8, color: 'red' },
            { label: 'Optimal Stock Items', value: 1180, color: 'green' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Replenishment Recommendations</h2>

          <div className="space-y-2">
            {replenishmentOrders.map((order) => (
              <div key={order.id} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.item}</h3>
                      <p className="text-sm text-gray-600">{order.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-2">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Current Stock</p>
                    <p className={`text-xl font-bold ${order.current < order.min ? 'text-red-600' : 'text-gray-900'}`}>
                      {order.current}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Min Stock</p>
                    <p className="text-xl font-bold text-orange-600">{order.min}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Max Stock</p>
                    <p className="text-xl font-bold text-green-600">{order.max}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-3 text-white">
                    <p className="text-xs opacity-90 mb-1">Recommended Order</p>
                    <p className="text-xl font-bold">{order.recommended}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        Approve & Order
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                        Modify
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
