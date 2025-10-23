'use client';

import React, { useState } from 'react';
import { DollarSign, Plus, Search, Edit2, Trash2, TrendingUp, Package } from 'lucide-react';

export default function FreightMaster() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockFreight = [
    {
      id: '1',
      code: 'FRT-001',
      name: 'Domestic Road - Standard',
      mode: 'Road',
      serviceLevel: 'Standard',
      baseRate: 500,
      perKmRate: 12,
      perKgRate: 1.5,
      minimumCharge: 500,
      currency: 'INR',
      status: 'Active'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Freight Master</h2>
        <p className="text-gray-600">Manage shipping charges and freight rates</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search freight..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Freight
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Freight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Per Km</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Per Kg</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockFreight.map((freight) => (
              <tr key={freight.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{freight.name}</div>
                  <div className="text-xs text-gray-500">{freight.code}</div>
                </td>
                <td className="px-6 py-4 text-sm">{freight.mode}</td>
                <td className="px-6 py-4 text-sm">₹{freight.baseRate}</td>
                <td className="px-6 py-4 text-sm">₹{freight.perKmRate}</td>
                <td className="px-6 py-4 text-sm">₹{freight.perKgRate}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                    {freight.status}
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
