'use client';

import React, { useState } from 'react';
import { Anchor, Plus, Search, Edit2, Trash2, MapPin, Globe } from 'lucide-react';

export default function PortMaster() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockPorts = [
    {
      id: '1',
      code: 'PORT-001',
      name: 'JNPT - Jawaharlal Nehru Port',
      portCode: 'INNSA',
      type: 'Seaport',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      facilities: ['Container', 'Bulk', 'RoRo', 'Liquid'],
      customsAvailable: true,
      status: 'Active'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Port Master</h2>
        <p className="text-gray-600">Manage import/export port locations</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Port
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Port</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Port Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facilities</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPorts.map((port) => (
              <tr key={port.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Anchor className="h-4 w-4 text-blue-600" />
                    {port.name}
                  </div>
                  <div className="text-xs text-gray-500">{port.code}</div>
                </td>
                <td className="px-6 py-4 text-sm font-mono">{port.portCode}</td>
                <td className="px-6 py-4 text-sm">{port.type}</td>
                <td className="px-6 py-4">
                  <div className="text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {port.city}, {port.state}
                  </div>
                  <div className="text-xs text-gray-500">
                    <Globe className="inline h-3 w-3 mr-1" />{port.country}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">
                  {port.facilities.slice(0, 3).join(', ')}
                  {port.facilities.length > 3 && ` +${port.facilities.length - 3}`}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                    {port.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Edit2 className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Edit</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">Delete</span>
                    </button>
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
