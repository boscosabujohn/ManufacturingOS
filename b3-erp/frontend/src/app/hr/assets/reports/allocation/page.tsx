'use client';

import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Package } from 'lucide-react';

interface AllocationSummary {
  category: string;
  total: number;
  allocated: number;
  available: number;
  maintenance: number;
  utilization: number;
}

export default function Page() {
  const [selectedLocation, setSelectedLocation] = useState('all');

  const mockData: AllocationSummary[] = [
    {
      category: 'Laptops',
      total: 250,
      allocated: 198,
      available: 42,
      maintenance: 10,
      utilization: 79.2
    },
    {
      category: 'Desktops',
      total: 180,
      allocated: 152,
      available: 22,
      maintenance: 6,
      utilization: 84.4
    },
    {
      category: 'Mobiles',
      total: 120,
      allocated: 98,
      available: 18,
      maintenance: 4,
      utilization: 81.7
    },
    {
      category: 'Monitors',
      total: 300,
      allocated: 245,
      available: 48,
      maintenance: 7,
      utilization: 81.7
    },
    {
      category: 'Furniture',
      total: 450,
      allocated: 389,
      available: 55,
      maintenance: 6,
      utilization: 86.4
    },
    {
      category: 'Printers',
      total: 85,
      allocated: 72,
      available: 10,
      maintenance: 3,
      utilization: 84.7
    }
  ];

  const stats = useMemo(() => {
    const totals = mockData.reduce((acc, item) => ({
      total: acc.total + item.total,
      allocated: acc.allocated + item.allocated,
      available: acc.available + item.available,
      maintenance: acc.maintenance + item.maintenance
    }), { total: 0, allocated: 0, available: 0, maintenance: 0 });

    return {
      ...totals,
      utilizationRate: ((totals.allocated / totals.total) * 100).toFixed(1)
    };
  }, [mockData]);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asset Allocation Report</h1>
        <p className="text-sm text-gray-600 mt-1">Overview of asset allocation across categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Assets</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Allocated</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.allocated}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-600">Available</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.available}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Utilization</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.utilizationRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Locations</option>
              <option value="mumbai">Mumbai Office</option>
              <option value="delhi">Delhi Office</option>
              <option value="bangalore">Bangalore Office</option>
              <option value="pune">Pune Office</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Export Report
            </button>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
              Print Report
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.category}</h3>
                  <p className="text-sm text-gray-600">Total: {item.total} units</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Utilization</p>
                <p className="text-2xl font-bold text-blue-600">{item.utilization}%</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600 uppercase font-medium mb-1">Allocated</p>
                <p className="text-xl font-bold text-green-700">{item.allocated}</p>
                <p className="text-xs text-green-600 mt-1">{((item.allocated / item.total) * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-yellow-600 uppercase font-medium mb-1">Available</p>
                <p className="text-xl font-bold text-yellow-700">{item.available}</p>
                <p className="text-xs text-yellow-600 mt-1">{((item.available / item.total) * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-orange-600 uppercase font-medium mb-1">Maintenance</p>
                <p className="text-xl font-bold text-orange-700">{item.maintenance}</p>
                <p className="text-xs text-orange-600 mt-1">{((item.maintenance / item.total) * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Allocation Progress</span>
                <span>{item.allocated} / {item.total}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden flex">
                <div
                  className="bg-green-500"
                  style={{ width: `${(item.allocated / item.total) * 100}%` }}
                ></div>
                <div
                  className="bg-yellow-500"
                  style={{ width: `${(item.available / item.total) * 100}%` }}
                ></div>
                <div
                  className="bg-orange-500"
                  style={{ width: `${(item.maintenance / item.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
