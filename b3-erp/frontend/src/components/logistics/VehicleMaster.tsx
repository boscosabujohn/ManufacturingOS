'use client';

import React, { useState } from 'react';
import { Truck, Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, Calendar, Wrench, Gauge, Eye, Download, Filter, AlertTriangle, X } from 'lucide-react';

interface Vehicle {
  id: string;
  code: string;
  registrationNumber: string;
  type: 'Truck' | 'Van' | 'Trailer' | 'Container' | 'Tanker' | 'Pickup';
  make: string;
  model: string;
  year: number;
  capacity: string;
  fuelType: 'Diesel' | 'Petrol' | 'CNG' | 'Electric';
  status: 'Active' | 'Maintenance' | 'Inactive' | 'Out of Service';
  lastService: Date;
  nextService: Date;
  mileage: number;
  driverAssigned?: string;
  insuranceExpiry: Date;
  permitExpiry: Date;
  averageSpeed: number;
  totalTrips: number;
}

export default function VehicleMaster() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const mockVehicles: Vehicle[] = [
    {
      id: '1',
      code: 'VEH-001',
      registrationNumber: 'MH-01-AB-1234',
      type: 'Truck',
      make: 'Tata',
      model: 'LPT 1613',
      year: 2022,
      capacity: '16 tons',
      fuelType: 'Diesel',
      status: 'Active',
      lastService: new Date('2024-02-15'),
      nextService: new Date('2024-05-15'),
      mileage: 45000,
      driverAssigned: 'Rajesh Kumar',
      insuranceExpiry: new Date('2025-06-30'),
      permitExpiry: new Date('2025-12-31'),
      averageSpeed: 55,
      totalTrips: 145
    },
    {
      id: '2',
      code: 'VEH-002',
      registrationNumber: 'KA-03-CD-5678',
      type: 'Van',
      make: 'Mahindra',
      model: 'Supro',
      year: 2023,
      capacity: '1.2 tons',
      fuelType: 'Diesel',
      status: 'Active',
      lastService: new Date('2024-03-10'),
      nextService: new Date('2024-06-10'),
      mileage: 28000,
      driverAssigned: 'Suresh Patel',
      insuranceExpiry: new Date('2025-08-15'),
      permitExpiry: new Date('2025-10-20'),
      averageSpeed: 60,
      totalTrips: 89
    },
    {
      id: '3',
      code: 'VEH-003',
      registrationNumber: 'DL-1C-EF-9012',
      type: 'Trailer',
      make: 'Ashok Leyland',
      model: 'U-Truck 2518',
      year: 2021,
      capacity: '25 tons',
      fuelType: 'Diesel',
      status: 'Maintenance',
      lastService: new Date('2024-03-20'),
      nextService: new Date('2024-04-05'),
      mileage: 78000,
      insuranceExpiry: new Date('2025-04-10'),
      permitExpiry: new Date('2025-09-15'),
      averageSpeed: 50,
      totalTrips: 234
    },
    {
      id: '4',
      code: 'VEH-004',
      registrationNumber: 'GJ-01-GH-3456',
      type: 'Container',
      make: 'BharatBenz',
      model: '4228R',
      year: 2022,
      capacity: '40 ft',
      fuelType: 'Diesel',
      status: 'Active',
      lastService: new Date('2024-01-25'),
      nextService: new Date('2024-04-25'),
      mileage: 62000,
      driverAssigned: 'Anil Sharma',
      insuranceExpiry: new Date('2025-07-22'),
      permitExpiry: new Date('2025-11-30'),
      averageSpeed: 48,
      totalTrips: 178
    },
    {
      id: '5',
      code: 'VEH-005',
      registrationNumber: 'TN-09-IJ-7890',
      type: 'Tanker',
      make: 'Volvo',
      model: 'FM 440',
      year: 2020,
      capacity: '18000 liters',
      fuelType: 'Diesel',
      status: 'Active',
      lastService: new Date('2024-02-28'),
      nextService: new Date('2024-05-28'),
      mileage: 95000,
      driverAssigned: 'Mohammed Ali',
      insuranceExpiry: new Date('2025-03-15'),
      permitExpiry: new Date('2025-05-20'),
      averageSpeed: 52,
      totalTrips: 312
    },
    {
      id: '6',
      code: 'VEH-006',
      registrationNumber: 'RJ-14-KL-2345',
      type: 'Pickup',
      make: 'Isuzu',
      model: 'D-Max V-Cross',
      year: 2023,
      capacity: '1 ton',
      fuelType: 'Diesel',
      status: 'Active',
      lastService: new Date('2024-03-05'),
      nextService: new Date('2024-06-05'),
      mileage: 18000,
      driverAssigned: 'Vikram Singh',
      insuranceExpiry: new Date('2025-09-10'),
      permitExpiry: new Date('2025-12-15'),
      averageSpeed: 65,
      totalTrips: 56
    },
    {
      id: '7',
      code: 'VEH-007',
      registrationNumber: 'WB-06-MN-6789',
      type: 'Truck',
      make: 'Eicher',
      model: 'Pro 6019',
      year: 2019,
      capacity: '6 tons',
      fuelType: 'Diesel',
      status: 'Inactive',
      lastService: new Date('2023-11-15'),
      nextService: new Date('2024-02-15'),
      mileage: 125000,
      insuranceExpiry: new Date('2024-12-20'),
      permitExpiry: new Date('2024-08-30'),
      averageSpeed: 45,
      totalTrips: 456
    },
    {
      id: '8',
      code: 'VEH-008',
      registrationNumber: 'HR-26-OP-0123',
      type: 'Van',
      make: 'Force',
      model: 'Traveller',
      year: 2022,
      capacity: '2 tons',
      fuelType: 'CNG',
      status: 'Active',
      lastService: new Date('2024-03-12'),
      nextService: new Date('2024-06-12'),
      mileage: 32000,
      driverAssigned: 'Ravi Verma',
      insuranceExpiry: new Date('2025-05-18'),
      permitExpiry: new Date('2025-11-25'),
      averageSpeed: 58,
      totalTrips: 102
    }
  ];

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: mockVehicles.length,
    active: mockVehicles.filter(v => v.status === 'Active').length,
    maintenance: mockVehicles.filter(v => v.status === 'Maintenance').length,
    totalMileage: mockVehicles.reduce((sum, v) => sum + v.mileage, 0),
    avgMileage: Math.round(mockVehicles.reduce((sum, v) => sum + v.mileage, 0) / mockVehicles.length),
    serviceDue: mockVehicles.filter(v => {
      const daysToService = Math.floor((v.nextService.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysToService <= 30 && daysToService > 0;
    }).length
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewModal(true);
  };

  const handleExport = () => {
    setToastMessage('Vehicles exported successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const isServiceDueSoon = (nextService: Date) => {
    const daysToService = Math.floor((nextService.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysToService <= 30 && daysToService > 0;
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="h-8 w-8 text-orange-600" />
              Vehicle Master
            </h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest leading-none">
              Manage fleet and vehicle information
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-200 bg-white text-gray-600 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 shadow-md font-black uppercase text-[10px] tracking-widest">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm font-medium">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-orange-600">{stats.maintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Mileage</p>
                <p className="text-2xl font-bold">{stats.totalMileage.toLocaleString()} km</p>
              </div>
              <Gauge className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Mileage</p>
                <p className="text-2xl font-bold">{stats.avgMileage.toLocaleString()} km</p>
              </div>
              <Gauge className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Service Due</p>
                <p className="text-2xl font-bold text-red-600">{stats.serviceDue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search vehicles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Vehicle
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="Truck">Truck</option>
                      <option value="Van">Van</option>
                      <option value="Trailer">Trailer</option>
                      <option value="Container">Container</option>
                      <option value="Tanker">Tanker</option>
                      <option value="Pickup">Pickup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Out of Service">Out of Service</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="p-12 text-center">
              <Truck className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 mb-2">No vehicles found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type & Capacity</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service Schedule</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mileage</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="text-sm font-medium">{vehicle.registrationNumber}</div>
                        <div className="text-xs text-gray-500">{vehicle.code} • {vehicle.make} {vehicle.model}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-sm">{vehicle.type}</div>
                        <div className="text-xs text-gray-500">{vehicle.capacity} • {vehicle.fuelType}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-sm">{vehicle.driverAssigned || 'Unassigned'}</div>
                        <div className="text-xs text-gray-500">{vehicle.totalTrips} trips</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {vehicle.nextService.toLocaleDateString()}
                        </div>
                        {isServiceDueSoon(vehicle.nextService) && (
                          <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                            <AlertTriangle className="h-3 w-3" />
                            Due soon
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-sm">{vehicle.mileage.toLocaleString()} km</div>
                        <div className="text-xs text-gray-500">{vehicle.averageSpeed} km/h avg</div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${vehicle.status === 'Active' ? 'bg-green-100 text-green-800' :
                          vehicle.status === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                            vehicle.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {vehicle.status === 'Active' && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                          {vehicle.status === 'Maintenance' && <Wrench className="inline h-3 w-3 mr-1" />}
                          {vehicle.status === 'Inactive' && <XCircle className="inline h-3 w-3 mr-1" />}
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewVehicle(vehicle)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                            <span className="text-gray-700">View</span>
                          </button>
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                            <Edit2 className="h-4 w-4 text-gray-600" />
                            <span className="text-gray-700">Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Vehicle Modal */}
        {showViewModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-3 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">{selectedVehicle.registrationNumber}</h3>
                  <p className="text-sm text-gray-500">{selectedVehicle.code}</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Vehicle Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Vehicle Details</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-sm font-medium">{selectedVehicle.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Capacity</p>
                      <p className="text-sm font-medium">{selectedVehicle.capacity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Make & Model</p>
                      <p className="text-sm font-medium">{selectedVehicle.make} {selectedVehicle.model}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Year</p>
                      <p className="text-sm font-medium">{selectedVehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fuel Type</p>
                      <p className="text-sm font-medium">{selectedVehicle.fuelType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-sm font-medium">{selectedVehicle.status}</p>
                    </div>
                  </div>
                </div>

                {/* Assignment & Performance */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Assignment & Performance</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600">Driver Assigned</p>
                      <p className="text-sm font-bold text-blue-700">{selectedVehicle.driverAssigned || 'Unassigned'}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-600">Total Trips</p>
                      <p className="text-sm font-bold text-green-700">{selectedVehicle.totalTrips}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs text-purple-600">Total Mileage</p>
                      <p className="text-sm font-bold text-purple-700">{selectedVehicle.mileage.toLocaleString()} km</p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-xs text-indigo-600">Average Speed</p>
                      <p className="text-sm font-bold text-indigo-700">{selectedVehicle.averageSpeed} km/h</p>
                    </div>
                  </div>
                </div>

                {/* Maintenance Schedule */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Maintenance Schedule</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Last Service</p>
                      <p className="text-sm font-medium">{selectedVehicle.lastService.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Next Service</p>
                      <p className="text-sm font-medium">{selectedVehicle.nextService.toLocaleDateString()}</p>
                      {isServiceDueSoon(selectedVehicle.nextService) && (
                        <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                          <AlertTriangle className="h-3 w-3" />
                          Service due within 30 days
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document Expiry */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Document Expiry</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Insurance Expiry</p>
                      <p className="text-sm font-medium">{selectedVehicle.insuranceExpiry.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Permit Expiry</p>
                      <p className="text-sm font-medium">{selectedVehicle.permitExpiry.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Vehicle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Download className="h-4 w-4" />
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
