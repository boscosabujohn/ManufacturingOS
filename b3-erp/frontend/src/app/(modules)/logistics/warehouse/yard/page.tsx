'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Truck, MapPin, Clock, AlertTriangle, CheckCircle, Package, Filter, Eye } from 'lucide-react';

interface YardVehicle {
  id: string;
  vehicleNo: string;
  carrierName: string;
  driverName: string;
  driverPhone: string;
  checkInTime: string;
  parkingSpot: string;
  vehicleType: 'truck' | 'trailer' | 'container';
  status: 'checked-in' | 'waiting' | 'at-dock' | 'loading' | 'departed';
  appointmentNo: string;
  dockAssigned: string;
  estimatedDeparture: string;
  waitTime: number;
  trailerNo: string;
  sealNo: string;
  notes: string;
}

export default function YardManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const yardVehicles: YardVehicle[] = [
    {
      id: '1',
      vehicleNo: 'TN-01-AB-1234',
      carrierName: 'Blue Dart Express',
      driverName: 'Rajesh Kumar',
      driverPhone: '+91-98765-43210',
      checkInTime: '2025-10-21 07:45',
      parkingSpot: 'YARD-A-12',
      vehicleType: 'truck',
      status: 'at-dock',
      appointmentNo: 'APT-2025-1001',
      dockAssigned: 'DOCK-A01',
      estimatedDeparture: '2025-10-21 10:00',
      waitTime: 30,
      trailerNo: '',
      sealNo: 'SEAL-98765',
      notes: 'Unloading in progress'
    },
    {
      id: '2',
      vehicleNo: 'KA-01-CD-3456',
      carrierName: 'VRL Logistics',
      driverName: 'Amit Patel',
      driverPhone: '+91-99876-54321',
      checkInTime: '2025-10-21 08:30',
      parkingSpot: 'YARD-B-05',
      vehicleType: 'trailer',
      status: 'waiting',
      appointmentNo: 'APT-2025-1003',
      dockAssigned: 'DOCK-B01',
      estimatedDeparture: '2025-10-21 11:00',
      waitTime: 45,
      trailerNo: 'TRL-12345',
      sealNo: 'SEAL-87654',
      notes: 'Waiting for dock availability'
    },
    {
      id: '3',
      vehicleNo: 'TN-04-GH-5678',
      carrierName: 'DHL Express',
      driverName: 'Priya Sharma',
      driverPhone: '+91-98234-56789',
      checkInTime: '2025-10-21 10:15',
      parkingSpot: 'YARD-A-08',
      vehicleType: 'truck',
      status: 'checked-in',
      appointmentNo: 'APT-2025-1002',
      dockAssigned: 'DOCK-A03',
      estimatedDeparture: '2025-10-21 13:00',
      waitTime: 0,
      trailerNo: '',
      sealNo: 'SEAL-76543',
      notes: 'Early arrival - waiting for scheduled time'
    },
    {
      id: '4',
      vehicleNo: 'MH-12-EF-7890',
      carrierName: 'Gati Ltd',
      driverName: 'Suresh Menon',
      driverPhone: '+91-97123-45678',
      checkInTime: '2025-10-21 09:30',
      parkingSpot: 'YARD-B-12',
      vehicleType: 'truck',
      status: 'at-dock',
      appointmentNo: 'APT-2025-1004',
      dockAssigned: 'DOCK-B02',
      estimatedDeparture: '2025-10-21 12:00',
      waitTime: 15,
      trailerNo: '',
      sealNo: 'SEAL-65432',
      notes: 'Paperwork being processed'
    },
    {
      id: '5',
      vehicleNo: 'TN-07-IJ-2345',
      carrierName: 'DTDC Courier',
      driverName: 'Deepak Singh',
      driverPhone: '+91-96543-21098',
      checkInTime: '2025-10-21 07:15',
      parkingSpot: 'YARD-C-03',
      vehicleType: 'truck',
      status: 'loading',
      appointmentNo: 'APT-2025-1005',
      dockAssigned: 'DOCK-C01',
      estimatedDeparture: '2025-10-21 09:30',
      waitTime: 10,
      trailerNo: '',
      sealNo: 'SEAL-54321',
      notes: '85% loading complete'
    },
    {
      id: '6',
      vehicleNo: 'HR-26-KL-6789',
      carrierName: 'FedEx',
      driverName: 'Vikas Reddy',
      driverPhone: '+91-95432-10987',
      checkInTime: '2025-10-21 08:20',
      parkingSpot: 'YARD-C-07',
      vehicleType: 'container',
      status: 'at-dock',
      appointmentNo: 'APT-2025-1006',
      dockAssigned: 'DOCK-C03',
      estimatedDeparture: '2025-10-21 10:30',
      waitTime: 15,
      trailerNo: 'CNT-67890',
      sealNo: 'SEAL-43210',
      notes: 'Container unloading in progress'
    },
    {
      id: '7',
      vehicleNo: 'WB-01-MN-4567',
      carrierName: 'Indian Post',
      driverName: 'Rahul Verma',
      driverPhone: '+91-94321-87654',
      checkInTime: '2025-10-21 12:45',
      parkingSpot: 'YARD-D-01',
      vehicleType: 'truck',
      status: 'checked-in',
      appointmentNo: 'APT-2025-1007',
      dockAssigned: 'DOCK-D01',
      estimatedDeparture: '2025-10-21 15:00',
      waitTime: 0,
      trailerNo: '',
      sealNo: 'SEAL-32109',
      notes: 'Scheduled for 13:00 - waiting in yard'
    },
    {
      id: '8',
      vehicleNo: 'DL-01-OP-8901',
      carrierName: 'Safexpress',
      driverName: 'Manoj Kumar',
      driverPhone: '+91-93210-98765',
      checkInTime: '2025-10-21 09:00',
      parkingSpot: 'YARD-B-18',
      vehicleType: 'trailer',
      status: 'waiting',
      appointmentNo: 'APT-2025-1008',
      dockAssigned: 'DOCK-B03',
      waitTime: 60,
      trailerNo: 'TRL-98765',
      sealNo: 'SEAL-21098',
      estimatedDeparture: '2025-10-21 12:30',
      notes: 'High wait time - priority needed'
    }
  ];

  const yardStats = {
    total: yardVehicles.length,
    checkedIn: yardVehicles.filter(v => v.status === 'checked-in').length,
    waiting: yardVehicles.filter(v => v.status === 'waiting').length,
    atDock: yardVehicles.filter(v => v.status === 'at-dock').length,
    loading: yardVehicles.filter(v => v.status === 'loading').length,
    avgWaitTime: Math.round(yardVehicles.reduce((sum, v) => sum + v.waitTime, 0) / yardVehicles.length),
    longWait: yardVehicles.filter(v => v.waitTime > 30).length
  };

  const filteredVehicles = yardVehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.parkingSpot.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'waiting': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'at-dock': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'loading': return 'bg-green-100 text-green-700 border-green-200';
      case 'departed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yard Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track vehicles and parking in warehouse yard</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{yardStats.total}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Vehicles</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{yardStats.checkedIn}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Checked In</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{yardStats.waiting}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Waiting</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{yardStats.atDock}</span>
          </div>
          <p className="text-xs font-medium opacity-90">At Dock</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{yardStats.loading}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Loading</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{yardStats.avgWaitTime}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Avg Wait (mins)</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{yardStats.longWait}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Long Wait</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by vehicle no, carrier, driver, or parking spot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="checked-in">Checked In</option>
            <option value="waiting">Waiting</option>
            <option value="at-dock">At Dock</option>
            <option value="loading">Loading</option>
            <option value="departed">Departed</option>
          </select>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Showing {filteredVehicles.length} of {yardStats.total} vehicles</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{vehicle.vehicleNo}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                    {vehicle.vehicleType}
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-600">{vehicle.carrierName}</p>
              </div>

              {vehicle.waitTime > 30 && (
                <div className="bg-red-50 rounded-lg p-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium mb-1">Driver</p>
                <p className="text-sm font-bold text-blue-900">{vehicle.driverName}</p>
                <p className="text-xs text-blue-700 mt-0.5">{vehicle.driverPhone}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600 font-medium mb-1">Parking Spot</p>
                <p className="text-lg font-bold text-green-900">{vehicle.parkingSpot}</p>
                <p className="text-xs text-green-700 mt-0.5">Checked in: {vehicle.checkInTime.split(' ')[1]}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-500">Appointment</p>
                  <p className="font-medium text-gray-900">{vehicle.appointmentNo}</p>
                </div>
                <div>
                  <p className="text-gray-500">Dock Assigned</p>
                  <p className="font-medium text-gray-900">{vehicle.dockAssigned}</p>
                </div>
                <div>
                  <p className="text-gray-500">Est. Departure</p>
                  <p className="font-medium text-gray-900">{vehicle.estimatedDeparture.split(' ')[1]}</p>
                </div>
                <div>
                  <p className="text-gray-500">Wait Time</p>
                  <p className={`font-medium ${vehicle.waitTime > 30 ? 'text-red-600' : vehicle.waitTime > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {vehicle.waitTime} mins
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {vehicle.trailerNo && (
                <div className="bg-purple-50 rounded-lg p-2">
                  <p className="text-xs text-purple-600 font-medium">Trailer</p>
                  <p className="text-sm font-bold text-purple-900">{vehicle.trailerNo}</p>
                </div>
              )}
              <div className="bg-orange-50 rounded-lg p-2">
                <p className="text-xs text-orange-600 font-medium">Seal No</p>
                <p className="text-sm font-bold text-orange-900">{vehicle.sealNo}</p>
              </div>
            </div>

            {vehicle.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-600 font-medium mb-1">Notes</p>
                <p className="text-sm text-yellow-900">{vehicle.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                View Details
              </button>
              {vehicle.status === 'waiting' && (
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium text-sm">
                  Assign Dock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No vehicles found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Yard Status Guide:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div><span className="font-medium">Checked In:</span> Vehicle entered yard, parking assigned</div>
          <div><span className="font-medium">Waiting:</span> Waiting for dock assignment or availability</div>
          <div><span className="font-medium">At Dock:</span> Vehicle moved to assigned dock door</div>
          <div><span className="font-medium">Loading:</span> Loading/unloading operation in progress</div>
        </div>
      </div>
    </div>
  );
}
