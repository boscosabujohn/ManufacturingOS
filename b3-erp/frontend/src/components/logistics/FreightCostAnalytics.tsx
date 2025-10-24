'use client';

import React from 'react';
import { DollarSign, TrendingDown, TrendingUp, PieChart, BarChart3 } from 'lucide-react';

export default function FreightCostAnalytics() {
  const costBreakdown = [
    { category: 'Line Haul', amount: 450000, percentage: 45, trend: 'down', change: -3.2 },
    { category: 'Fuel Surcharge', amount: 180000, percentage: 18, trend: 'up', change: 5.1 },
    { category: 'Accessorial Charges', amount: 120000, percentage: 12, trend: 'up', change: 2.3 },
    { category: 'Insurance', amount: 80000, percentage: 8, trend: 'down', change: -1.5 },
    { category: 'Handling', amount: 170000, percentage: 17, trend: 'up', change: 1.8 },
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Freight Cost Analytics</h1>
          <p className="text-gray-600">Comprehensive freight cost analysis and optimization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total Freight Cost</p>
            <p className="text-3xl font-bold text-blue-600">₹{(totalCost / 100000).toFixed(1)}L</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Cost per Shipment</p>
            <p className="text-3xl font-bold text-green-600">₹4,200</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Cost per Km</p>
            <p className="text-3xl font-bold text-purple-600">₹52</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Savings This Month</p>
            <p className="text-3xl font-bold text-orange-600">₹45K</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cost Breakdown</h2>

          <div className="space-y-4">
            {costBreakdown.map((item) => (
              <div key={item.category} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.category}</h3>
                    <p className="text-sm text-gray-600">₹{item.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">{item.percentage}%</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                      item.trend === 'down' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      <span className="text-sm font-medium">{Math.abs(item.change)}%</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
