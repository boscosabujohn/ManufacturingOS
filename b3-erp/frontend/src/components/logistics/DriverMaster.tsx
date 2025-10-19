'use client';

import React, { useState } from 'react';
import { User, Plus, Search, Edit2, Trash2, CheckCircle2, Phone, CreditCard, Award } from 'lucide-react';

export default function DriverMaster() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockDrivers = [
    {
      id: '1',
      code: 'DRV-001',
      name: 'Rajesh Kumar',
      phone: '+91-9876543210',
      licenseNumber: 'MH0120210012345',
      licenseType: 'Heavy Vehicle',
      licenseExpiry: new Date('2026-12-31'),
      experience: 15,
      status: 'Active'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Driver Master</h2>
        <p className="text-gray-600">Manage driver personnel database</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Driver
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockDrivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{driver.name}</div>
                  <div className="text-xs text-gray-500">{driver.code}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Phone className="inline h-3 w-3 mr-1" />{driver.phone}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{driver.licenseNumber}</div>
                  <div className="text-xs text-gray-500">{driver.licenseType}</div>
                </td>
                <td className="px-6 py-4 text-sm">{driver.experience} years</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                    {driver.status}
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
