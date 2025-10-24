'use client';

import React from 'react';
import { Navigation, TrendingDown, Clock, Fuel, MapPin } from 'lucide-react';

export default function RouteOptimization() {
  const optimizedRoutes = [
    {
      id: 'ROUTE-001',
      from: 'Mumbai Warehouse',
      to: 'Delhi Hub',
      originalDistance: 1450,
      optimizedDistance: 1420,
      originalTime: '22h 30m',
      optimizedTime: '21h 45m',
      savings: { distance: 30, time: 45, fuel: 12, cost: 2400 },
      stops: ['Nashik', 'Indore', 'Jaipur'],
    },
    {
      id: 'ROUTE-002',
      from: 'Bangalore Plant',
      to: 'Hyderabad Distribution',
      originalDistance: 575,
      optimizedDistance: 560,
      originalTime: '9h 15m',
      optimizedTime: '8h 50m',
      savings: { distance: 15, time: 25, fuel: 6, cost: 1200 },
      stops: ['Kurnool'],
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Route Optimization & Planning</h1>
          <p className="text-gray-600">AI-powered route optimization for cost and time savings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Routes Optimized', value: '248', color: 'blue' },
            { label: 'Distance Saved', value: '2,450 km', color: 'green' },
            { label: 'Time Saved', value: '45 hrs', color: 'purple' },
            { label: 'Cost Savings', value: '₹1.8L', color: 'orange' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Optimized Routes</h2>

          <div className="space-y-6">
            {optimizedRoutes.map((route) => (
              <div key={route.id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Navigation className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{route.from} → {route.to}</h3>
                      <p className="text-sm text-gray-600">Via: {route.stops.join(', ')}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {route.savings.distance} km saved
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Original Distance</p>
                    <p className="text-lg font-bold text-red-600 line-through">{route.originalDistance} km</p>
                    <p className="text-lg font-bold text-green-600">{route.optimizedDistance} km</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Travel Time</p>
                    <p className="text-lg font-bold text-red-600 line-through">{route.originalTime}</p>
                    <p className="text-lg font-bold text-green-600">{route.optimizedTime}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Fuel Savings</p>
                    <p className="text-lg font-bold text-green-600">{route.savings.fuel} L</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Cost Savings</p>
                    <p className="text-lg font-bold text-green-600">₹{route.savings.cost.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    Apply Route
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
