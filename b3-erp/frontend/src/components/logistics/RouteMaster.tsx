'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Search, Edit2, Trash2, Navigation, Clock } from 'lucide-react';

export default function RouteMaster() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockRoutes = [
    {
      id: '1',
      code: 'RTE-001',
      name: 'Mumbai to Delhi Express',
      origin: 'Mumbai',
      destination: 'Delhi',
      distance: 1400,
      estimatedTime: '24 hours',
      stops: ['Surat', 'Vadodara', 'Ahmedabad'],
      status: 'Active'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Route Master</h2>
        <p className="text-gray-600">Manage transportation routes and waypoints</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Route
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origin - Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stops</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockRoutes.map((route) => (
              <tr key={route.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{route.name}</div>
                  <div className="text-xs text-gray-500">{route.code}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    {route.origin}
                    <Navigation className="h-3 w-3 text-gray-400" />
                    <MapPin className="h-4 w-4 text-red-600" />
                    {route.destination}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{route.distance} km</td>
                <td className="px-6 py-4 text-xs text-gray-600">
                  {route.stops.join(', ')}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                    {route.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600"><Edit2 className="h-4 w-4" /></button>
                    <button className="text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
