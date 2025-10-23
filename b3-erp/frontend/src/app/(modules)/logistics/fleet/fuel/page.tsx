'use client';

import React, { useState } from 'react';
import {
  Fuel,
  Plus,
  Edit2,
  Eye,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Truck,
  MapPin,
  FileText
} from 'lucide-react';

interface FuelRecord {
  id: number;
  fuelId: string;
  vehicleId: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  fuelType: 'diesel' | 'petrol' | 'cng' | 'electric';
  quantity: number; // liters or kWh
  unitPrice: number; // per liter or kWh
  totalCost: number;
  fuelStation: string;
  location: string;
  odometer: number; // km
  previousOdometer: number; // km
  distanceCovered: number; // km
  fuelEfficiency: number; // km/liter or km/kWh
  fillType: 'full-tank' | 'partial' | 'top-up';
  paymentMethod: 'cash' | 'card' | 'fuel-card' | 'credit';
  invoiceNumber: string;
  filledBy: string;
  filledDate: string;
  filledTime: string;
  tripId: string | null;
  notes: string;
  status: 'verified' | 'pending' | 'disputed' | 'approved';
  verifiedBy: string | null;
  expectedEfficiency: number; // km/liter
  efficiencyVariance: number; // percentage
  anomalyDetected: boolean;
}

export default function FleetFuelPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [selectedFuelType, setSelectedFuelType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([
    {
      id: 1,
      fuelId: 'FUEL-2024-001',
      vehicleId: 'VEH-001',
      vehicleNumber: 'MH-01-AB-1234',
      vehicleType: '32-Ft Truck',
      driverName: 'Ramesh Sharma',
      fuelType: 'diesel',
      quantity: 285,
      unitPrice: 94.5,
      totalCost: 26932.5,
      fuelStation: 'Indian Oil Petrol Pump',
      location: 'Vadodara, Gujarat',
      odometer: 125680,
      previousOdometer: 124255,
      distanceCovered: 1425,
      fuelEfficiency: 5.0,
      fillType: 'full-tank',
      paymentMethod: 'fuel-card',
      invoiceNumber: 'INV-VAD-2024-001',
      filledBy: 'Pump Attendant',
      filledDate: '2024-10-21',
      filledTime: '14:30',
      tripId: 'TRP-2024-001',
      notes: 'Full tank refill during trip stopover',
      status: 'verified',
      verifiedBy: 'Fleet Manager',
      expectedEfficiency: 5.2,
      efficiencyVariance: -3.8,
      anomalyDetected: false
    },
    {
      id: 2,
      fuelId: 'FUEL-2024-002',
      vehicleId: 'VEH-002',
      vehicleNumber: 'KA-05-CD-5678',
      vehicleType: '20-Ft Container',
      driverName: 'Suresh Kumar',
      fuelType: 'diesel',
      quantity: 95,
      unitPrice: 93.8,
      totalCost: 8911,
      fuelStation: 'HP Petrol Pump',
      location: 'Bangalore, Karnataka',
      odometer: 89450,
      previousOdometer: 89100,
      distanceCovered: 350,
      fuelEfficiency: 3.7,
      fillType: 'top-up',
      paymentMethod: 'fuel-card',
      invoiceNumber: 'INV-BLR-2024-002',
      filledBy: 'Pump Attendant',
      filledDate: '2024-10-20',
      filledTime: '16:45',
      tripId: null,
      notes: 'Top-up before next trip',
      status: 'verified',
      verifiedBy: 'Fleet Manager',
      expectedEfficiency: 4.0,
      efficiencyVariance: -7.5,
      anomalyDetected: false
    },
    {
      id: 3,
      fuelId: 'FUEL-2024-003',
      vehicleId: 'VEH-003',
      vehicleNumber: 'WB-02-EF-9012',
      vehicleType: '40-Ft Truck',
      driverName: 'Mohan Das',
      fuelType: 'diesel',
      quantity: 380,
      unitPrice: 95.2,
      totalCost: 36176,
      fuelStation: 'Bharat Petroleum',
      location: 'Bhubaneswar, Odisha',
      odometer: 215680,
      previousOdometer: 213630,
      distanceCovered: 2050,
      fuelEfficiency: 5.4,
      fillType: 'full-tank',
      paymentMethod: 'fuel-card',
      invoiceNumber: 'INV-BBS-2024-003',
      filledBy: 'Pump Attendant',
      filledDate: '2024-10-21',
      filledTime: '10:15',
      tripId: 'TRP-2024-003',
      notes: 'Full tank refill during long-haul trip',
      status: 'verified',
      verifiedBy: 'Fleet Manager',
      expectedEfficiency: 5.0,
      efficiencyVariance: 8.0,
      anomalyDetected: false
    },
    {
      id: 4,
      fuelId: 'FUEL-2024-004',
      vehicleId: 'VEH-004',
      vehicleNumber: 'TS-09-GH-3456',
      vehicleType: '24-Ft Truck',
      driverName: 'Prakash Reddy',
      fuelType: 'diesel',
      quantity: 115,
      unitPrice: 94.0,
      totalCost: 10810,
      fuelStation: 'Indian Oil Petrol Pump',
      location: 'Hyderabad, Telangana',
      odometer: 145280,
      previousOdometer: 144705,
      distanceCovered: 575,
      fuelEfficiency: 5.0,
      fillType: 'full-tank',
      paymentMethod: 'fuel-card',
      invoiceNumber: 'INV-HYD-2024-004',
      filledBy: 'Pump Attendant',
      filledDate: '2024-10-19',
      filledTime: '18:20',
      tripId: 'TRP-2024-004',
      notes: 'Full tank after trip completion',
      status: 'verified',
      verifiedBy: 'Fleet Manager',
      expectedEfficiency: 4.8,
      efficiencyVariance: 4.2,
      anomalyDetected: false
    },
    {
      id: 5,
      fuelId: 'FUEL-2024-005',
      vehicleId: 'VEH-005',
      vehicleNumber: 'MH-12-IJ-7890',
      vehicleType: '18-Ft Truck',
      driverName: 'Ganesh Patil',
      fuelType: 'diesel',
      quantity: 68,
      unitPrice: 93.5,
      totalCost: 6358,
      fuelStation: 'HP Petrol Pump',
      location: 'Pune, Maharashtra',
      odometer: 98750,
      previousOdometer: 98265,
      distanceCovered: 485,
      fuelEfficiency: 7.1,
      fillType: 'full-tank',
      paymentMethod: 'fuel-card',
      invoiceNumber: 'INV-PUN-2024-005',
      filledBy: 'Pump Attendant',
      filledDate: '2024-10-20',
      filledTime: '11:30',
      tripId: 'TRP-2024-005',
      notes: 'Excellent fuel efficiency achieved',
      status: 'verified',
      verifiedBy: 'Fleet Manager',
      expectedEfficiency: 6.5,
      efficiencyVariance: 9.2,
      anomalyDetected: false
    },
    {
      id: 6,
      fuelId: 'FUEL-2024-006',
      vehicleId: 'VEH-006',
      vehicleNumber: 'DL-03-KL-2468',
      vehicleType: '28-Ft Truck',
      driverName: 'Vijay Singh',
      fuelType: 'diesel',
      quantity: 148,
      unitPrice: 96.0,
      totalCost: 14208,
      fuelStation: 'Bharat Petroleum',
      location: 'Delhi, Delhi',
      odometer: 178920,
      previousOdometer: 178385,
      distanceCovered: 535,
      fuelEfficiency: 3.6,
      fillType: 'full-tank',
      paymentMethod: 'fuel-card',
      invoiceNumber: 'INV-DEL-2024-006',
      filledBy: 'Pump Attendant',
      filledDate: '2024-10-21',
      filledTime: '09:45',
      tripId: 'TRP-2024-006',
      notes: 'Below expected efficiency - requires investigation',
      status: 'pending',
      verifiedBy: null,
      expectedEfficiency: 5.5,
      efficiencyVariance: -34.5,
      anomalyDetected: true
    },
    {
      id: 7,
      fuelId: 'FUEL-2024-007',
      vehicleId: 'VEH-007',
      vehicleNumber: 'TN-01-MN-1357',
      vehicleType: '32-Ft Truck',
      driverName: 'Murugan Subramanian',
      fuelType: 'diesel',
      quantity: 140,
      unitPrice: 92.8,
      totalCost: 12992,
      fuelStation: 'Indian Oil Petrol Pump',
      location: 'Chennai, Tamil Nadu',
      odometer: 156890,
      previousOdometer: 156195,
      distanceCovered: 695,
      fuelEfficiency: 5.0,
      fillType: 'full-tank',
      paymentMethod: 'fuel-card',
      invoiceNumber: 'INV-CHN-2024-007',
      filledBy: 'Pump Attendant',
      filledDate: '2024-10-20',
      filledTime: '15:00',
      tripId: 'TRP-2024-007',
      notes: 'Full tank refill after long trip',
      status: 'verified',
      verifiedBy: 'Fleet Manager',
      expectedEfficiency: 5.2,
      efficiencyVariance: -3.8,
      anomalyDetected: false
    },
    {
      id: 8,
      fuelId: 'FUEL-2024-008',
      vehicleId: 'VEH-008',
      vehicleNumber: 'GJ-01-OP-2580',
      vehicleType: '20-Ft Truck',
      driverName: 'Bharat Patel',
      fuelType: 'diesel',
      quantity: 107,
      unitPrice: 93.0,
      totalCost: 9951,
      fuelStation: 'HP Petrol Pump',
      location: 'Ahmedabad, Gujarat',
      odometer: 134560,
      previousOdometer: 134025,
      distanceCovered: 535,
      fuelEfficiency: 5.0,
      fillType: 'full-tank',
      paymentMethod: 'fuel-card',
      invoiceNumber: 'INV-AHM-2024-008',
      filledBy: 'Pump Attendant',
      filledDate: '2024-10-19',
      filledTime: '14:00',
      tripId: 'TRP-2024-008',
      notes: 'Normal fuel consumption',
      status: 'verified',
      verifiedBy: 'Fleet Manager',
      expectedEfficiency: 5.0,
      efficiencyVariance: 0.0,
      anomalyDetected: false
    },
    {
      id: 9,
      fuelId: 'FUEL-2024-009',
      vehicleId: 'VEH-001',
      vehicleNumber: 'MH-01-AB-1234',
      vehicleType: '32-Ft Truck',
      driverName: 'Ramesh Sharma',
      fuelType: 'diesel',
      quantity: 320,
      unitPrice: 95.0,
      totalCost: 30400,
      fuelStation: 'Bharat Petroleum',
      location: 'Mumbai, Maharashtra',
      odometer: 124255,
      previousOdometer: 122830,
      distanceCovered: 1425,
      fuelEfficiency: 4.5,
      fillType: 'full-tank',
      paymentMethod: 'fuel-card',
      invoiceNumber: 'INV-MUM-2024-009',
      filledBy: 'Pump Attendant',
      filledDate: '2024-10-18',
      filledTime: '08:00',
      tripId: 'TRP-2024-001',
      notes: 'Trip start - full tank',
      status: 'verified',
      verifiedBy: 'Fleet Manager',
      expectedEfficiency: 5.0,
      efficiencyVariance: -10.0,
      anomalyDetected: false
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'verified': 'text-green-600 bg-green-50 border-green-200',
      'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'disputed': 'text-red-600 bg-red-50 border-red-200',
      'approved': 'text-blue-600 bg-blue-50 border-blue-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getFillTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'full-tank': 'text-green-600 bg-green-50',
      'partial': 'text-blue-600 bg-blue-50',
      'top-up': 'text-purple-600 bg-purple-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const getEfficiencyColor = (variance: number) => {
    if (variance >= 0) return 'text-green-600';
    if (variance >= -10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalFuelRecords = fuelRecords.length;
  const totalFuelConsumed = fuelRecords.reduce((sum, r) => sum + r.quantity, 0);
  const totalFuelCost = fuelRecords.reduce((sum, r) => sum + r.totalCost, 0);
  const totalDistance = fuelRecords.reduce((sum, r) => sum + r.distanceCovered, 0);
  const avgEfficiency = totalDistance / totalFuelConsumed;
  const anomalies = fuelRecords.filter(r => r.anomalyDetected).length;

  const filteredRecords = fuelRecords.filter(record => {
    const matchesSearch = record.fuelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicle = selectedVehicle === 'all' || record.vehicleNumber === selectedVehicle;
    const matchesFuelType = selectedFuelType === 'all' || record.fuelType === selectedFuelType;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesVehicle && matchesFuelType && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Fuel className="w-8 h-8 text-green-600" />
            <span>Fleet Fuel Management</span>
          </h1>
          <p className="text-gray-600 mt-1">Track fuel consumption, costs, and efficiency</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Fuel Record</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Fuel className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{totalFuelConsumed.toFixed(0)}</span>
          </div>
          <div className="text-sm font-medium text-green-700">Total Fuel (Liters)</div>
          <div className="text-xs text-green-600 mt-1">Across {totalFuelRecords} records</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">₹{(totalFuelCost / 1000).toFixed(0)}K</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Total Fuel Cost</div>
          <div className="text-xs text-blue-600 mt-1">₹{totalFuelCost.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{avgEfficiency.toFixed(1)}</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Avg Efficiency</div>
          <div className="text-xs text-purple-600 mt-1">km/liter</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{anomalies}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Anomalies</div>
          <div className="text-xs text-orange-600 mt-1">Requires Review</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search fuel records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Vehicles</option>
            {Array.from(new Set(fuelRecords.map(r => r.vehicleNumber))).map(vehicle => (
              <option key={vehicle} value={vehicle}>{vehicle}</option>
            ))}
          </select>

          <select
            value={selectedFuelType}
            onChange={(e) => setSelectedFuelType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Fuel Types</option>
            <option value="diesel">Diesel</option>
            <option value="petrol">Petrol</option>
            <option value="cng">CNG</option>
            <option value="electric">Electric</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="disputed">Disputed</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Fuel Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location & Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className={`hover:bg-gray-50 ${record.anomalyDetected ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{record.fuelId}</div>
                    <div className="text-xs text-gray-500">{record.invoiceNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{record.vehicleNumber}</div>
                    <div className="text-sm text-gray-600">{record.vehicleType}</div>
                    <div className="text-xs text-gray-500">ODO: {record.odometer.toLocaleString()} km</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.driverName}</div>
                    {record.tripId && (
                      <div className="text-xs text-blue-600">{record.tripId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {record.quantity.toFixed(1)} L {record.fuelType.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-600">
                      ₹{record.unitPrice.toFixed(2)}/L
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getFillTypeColor(record.fillType)}`}>
                      {record.fillType.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-900">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <span>{record.location}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{record.fuelStation}</div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(record.filledDate).toLocaleDateString()} {record.filledTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-bold text-gray-900">{record.distanceCovered}</div>
                    <div className="text-xs text-gray-500">km covered</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {record.fuelEfficiency.toFixed(1)} km/L
                    </div>
                    <div className={`flex items-center space-x-1 text-xs ${getEfficiencyColor(record.efficiencyVariance)}`}>
                      {record.efficiencyVariance >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{Math.abs(record.efficiencyVariance).toFixed(1)}%</span>
                    </div>
                    {record.anomalyDetected && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-600">Anomaly</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{record.totalCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {record.paymentMethod.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Edit</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Document</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fuel Management Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Fuel className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Fuel Tracking</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Record every fuel transaction with quantity, cost, and odometer readings for accurate consumption tracking.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Fuel quantity and unit price tracking</div>
            <div>• Odometer reading verification</div>
            <div>• Invoice and payment method recording</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Efficiency Analysis</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Calculate fuel efficiency (km/liter) and compare against expected values to identify performance issues.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Automatic efficiency calculation</div>
            <div>• Variance from expected efficiency</div>
            <div>• Efficiency trend analysis</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Anomaly Detection</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Automatically detect unusual fuel consumption patterns and efficiency deviations for investigation.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Significant efficiency variance detection</div>
            <div>• Unusual consumption pattern alerts</div>
            <div>• Fuel theft prevention</div>
          </div>
        </div>
      </div>
    </div>
  );
}
