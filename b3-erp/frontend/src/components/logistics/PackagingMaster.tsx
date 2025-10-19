'use client';

import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Box, Ruler } from 'lucide-react';

export default function PackagingMaster() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockPackaging = [
    {
      id: '1',
      code: 'PKG-001',
      name: 'Standard Cardboard Box',
      type: 'Box',
      material: 'Corrugated Cardboard',
      dimensions: '40x30x30 cm',
      maxWeight: '25 kg',
      cost: 50,
      status: 'Active'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Packaging Master</h2>
        <p className="text-gray-600">Manage packaging types and specifications</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search packaging..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Packaging
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Packaging</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type & Material</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimensions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPackaging.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{pkg.name}</div>
                  <div className="text-xs text-gray-500">{pkg.code}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{pkg.type}</div>
                  <div className="text-xs text-gray-500">{pkg.material}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Ruler className="inline h-3 w-3 mr-1" />{pkg.dimensions}
                </td>
                <td className="px-6 py-4 text-sm">{pkg.maxWeight}</td>
                <td className="px-6 py-4 text-sm">₹{pkg.cost}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                    {pkg.status}
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
