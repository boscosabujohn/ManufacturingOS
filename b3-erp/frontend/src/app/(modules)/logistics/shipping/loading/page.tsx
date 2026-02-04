'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Package, Truck, CheckCircle, Clock, AlertTriangle, User, Weight, Maximize } from 'lucide-react';

interface LoadingBay {
  id: string;
  bayNo: string;
  bayName: string;
  status: 'available' | 'loading' | 'occupied' | 'maintenance';
  currentShipment: string;
  vehicleNo: string;
  driverName: string;
  startTime: string;
  estimatedEnd: string;
  loadedItems: number;
  totalItems: number;
  loadedWeight: number;
  totalWeight: number;
  progress: number;
}

export default function LoadingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadingBays: LoadingBay[] = [
    {
      id: '1',
      bayNo: 'BAY-01',
      bayName: 'Loading Bay 1',
      status: 'loading',
      currentShipment: 'OB-2025-0531',
      vehicleNo: 'TN-01-AB-1234',
      driverName: 'Rajesh Kumar',
      startTime: '2025-10-21 08:30',
      estimatedEnd: '2025-10-21 10:00',
      loadedItems: 5,
      totalItems: 8,
      loadedWeight: 1250,
      totalWeight: 2000,
      progress: 62.5
    },
    {
      id: '2',
      bayNo: 'BAY-02',
      bayName: 'Loading Bay 2',
      status: 'loading',
      currentShipment: 'OB-2025-0536',
      vehicleNo: 'TN-06-KL-2345',
      driverName: 'Mohammed Ali',
      startTime: '2025-10-21 09:00',
      estimatedEnd: '2025-10-21 10:45',
      loadedItems: 3,
      totalItems: 7,
      loadedWeight: 890,
      totalWeight: 1850,
      progress: 42.9
    },
    {
      id: '3',
      bayNo: 'BAY-03',
      bayName: 'Loading Bay 3',
      status: 'occupied',
      currentShipment: 'OB-2025-0532',
      vehicleNo: 'TN-02-CD-5678',
      driverName: 'Suresh Reddy',
      startTime: '2025-10-21 10:00',
      estimatedEnd: '2025-10-21 11:15',
      loadedItems: 0,
      totalItems: 5,
      loadedWeight: 0,
      totalWeight: 1420,
      progress: 0
    },
    {
      id: '4',
      bayNo: 'BAY-04',
      bayName: 'Loading Bay 4',
      status: 'available',
      currentShipment: '',
      vehicleNo: '',
      driverName: '',
      startTime: '',
      estimatedEnd: '',
      loadedItems: 0,
      totalItems: 0,
      loadedWeight: 0,
      totalWeight: 0,
      progress: 0
    },
    {
      id: '5',
      bayNo: 'BAY-05',
      bayName: 'Loading Bay 5',
      status: 'available',
      currentShipment: '',
      vehicleNo: '',
      driverName: '',
      startTime: '',
      estimatedEnd: '',
      loadedItems: 0,
      totalItems: 0,
      loadedWeight: 0,
      totalWeight: 0,
      progress: 0
    },
    {
      id: '6',
      bayNo: 'BAY-06',
      bayName: 'Loading Bay 6',
      status: 'maintenance',
      currentShipment: '',
      vehicleNo: '',
      driverName: '',
      startTime: '',
      estimatedEnd: '',
      loadedItems: 0,
      totalItems: 0,
      loadedWeight: 0,
      totalWeight: 0,
      progress: 0
    }
  ];

  const filteredBays = loadingBays.filter(bay => {
    const matchesSearch = bay.bayNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bay.bayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bay.currentShipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bay.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bay.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'loading': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'occupied': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'maintenance': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-3 h-3" />;
      case 'loading': return <Truck className="w-3 h-3" />;
      case 'occupied': return <Package className="w-3 h-3" />;
      case 'maintenance': return <AlertTriangle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-600';
    if (progress >= 50) return 'bg-blue-600';
    if (progress >= 25) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loading Bays</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor and manage loading bay operations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Available</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {loadingBays.filter(b => b.status === 'available').length}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Loading</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {loadingBays.filter(b => b.status === 'loading').length}
              </p>
            </div>
            <Truck className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Occupied</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">
                {loadingBays.filter(b => b.status === 'occupied').length}
              </p>
            </div>
            <Package className="w-6 h-6 text-yellow-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Maintenance</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {loadingBays.filter(b => b.status === 'maintenance').length}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-700" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by bay, shipment, or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="loading">Loading</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBays.map((bay) => (
          <div key={bay.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Maximize className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{bay.bayNo}</h3>
                  <p className="text-sm text-gray-500">{bay.bayName}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bay.status)}`}>
                {getStatusIcon(bay.status)}
                {bay.status.toUpperCase()}
              </span>
            </div>

            {bay.status === 'loading' || bay.status === 'occupied' ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Shipment No</p>
                      <p className="text-sm font-semibold text-blue-600">{bay.currentShipment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Vehicle No</p>
                      <p className="text-sm font-mono font-semibold text-gray-900">{bay.vehicleNo}</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-700">Driver: <span className="font-semibold">{bay.driverName}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-blue-600 font-medium">Items Loaded</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {bay.loadedItems}<span className="text-sm text-blue-600">/{bay.totalItems}</span>
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Weight className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-purple-600 font-medium">Weight (kg)</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      {bay.loadedWeight}<span className="text-sm text-purple-600">/{bay.totalWeight}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Loading Progress</p>
                    <p className="text-sm font-bold text-gray-900">{bay.progress.toFixed(0)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${getProgressColor(bay.progress)}`}
                      style={{ width: `${bay.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-500">Start Time</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="font-semibold text-gray-900">{bay.startTime}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated End</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-green-500" />
                      <p className="font-semibold text-green-600">{bay.estimatedEnd}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : bay.status === 'available' ? (
              <div className="py-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                <p className="text-green-700 font-semibold">Bay Available</p>
                <p className="text-sm text-gray-500 mt-1">Ready for next shipment</p>
              </div>
            ) : (
              <div className="py-8 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-3" />
                <p className="text-red-700 font-semibold">Under Maintenance</p>
                <p className="text-sm text-gray-500 mt-1">Bay temporarily unavailable</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredBays.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Truck className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-500">No loading bays found</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Loading Bay Operations:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li><strong>Available:</strong> Bay is empty and ready to receive next shipment</li>
          <li><strong>Occupied:</strong> Vehicle assigned to bay, awaiting loading start</li>
          <li><strong>Loading:</strong> Active loading operation in progress</li>
          <li><strong>Maintenance:</strong> Bay under maintenance or repair, temporarily unavailable</li>
          <li>Monitor loading progress in real-time to optimize bay utilization</li>
          <li>Ensure proper weight distribution and secure cargo before dispatch</li>
        </ul>
      </div>
    </div>
  );
}
