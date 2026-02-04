'use client';

import React, { useState } from 'react';
import {
  Send,
  Plus,
  Edit2,
  Eye,
  Search,
  Truck,
  User,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface DispatchDetails {
  id: number;
  dispatchId: string;
  loadId: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  origin: string;
  destination: string;
  routeCode: string;
  distance: number; // in km
  estimatedTime: number; // in hours
  scheduledDeparture: string;
  actualDeparture: string | null;
  estimatedArrival: string;
  actualArrival: string | null;
  shipments: number;
  totalWeight: number; // in kg
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'scheduled' | 'departed' | 'in-transit' | 'delayed' | 'arrived' | 'cancelled';
  currentLocation: string;
  completionPercentage: number;
  dispatchedBy: string;
  remarks: string;
  fuelCost: number;
  tollCost: number;
}

export default function DispatchManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const [dispatches, setDispatches] = useState<DispatchDetails[]>([
    {
      id: 1,
      dispatchId: 'DSP-2024-001',
      loadId: 'LD-2024-001',
      vehicleNumber: 'MH-01-AB-1234',
      driverName: 'Ramesh Sharma',
      driverPhone: '+91-9876543210',
      origin: 'Mumbai Warehouse',
      destination: 'Delhi Distribution Center',
      routeCode: 'RT-MUM-DEL-001',
      distance: 1425,
      estimatedTime: 24,
      scheduledDeparture: '2024-10-22 18:00',
      actualDeparture: '2024-10-22 18:30',
      estimatedArrival: '2024-10-23 18:00',
      actualArrival: null,
      shipments: 15,
      totalWeight: 18500,
      priority: 'high',
      status: 'in-transit',
      currentLocation: 'Vadodara Hub',
      completionPercentage: 35,
      dispatchedBy: 'Rajesh Kumar',
      remarks: 'On schedule',
      fuelCost: 35000,
      tollCost: 8000
    },
    {
      id: 2,
      dispatchId: 'DSP-2024-002',
      loadId: 'LD-2024-002',
      vehicleNumber: 'KA-05-CD-5678',
      driverName: 'Suresh Kumar',
      driverPhone: '+91-9876543211',
      origin: 'Bangalore Plant',
      destination: 'Chennai Port',
      routeCode: 'RT-BLR-CHN-001',
      distance: 350,
      estimatedTime: 7,
      scheduledDeparture: '2024-10-23 08:00',
      actualDeparture: null,
      estimatedArrival: '2024-10-23 15:00',
      actualArrival: null,
      shipments: 8,
      totalWeight: 8200,
      priority: 'urgent',
      status: 'scheduled',
      currentLocation: 'Bangalore Plant',
      completionPercentage: 0,
      dispatchedBy: 'Priya Singh',
      remarks: 'Ready for dispatch',
      fuelCost: 9000,
      tollCost: 2500
    },
    {
      id: 3,
      dispatchId: 'DSP-2024-003',
      loadId: 'LD-2024-003',
      vehicleNumber: 'WB-02-EF-9012',
      driverName: 'Mohan Das',
      driverPhone: '+91-9876543212',
      origin: 'Kolkata Depot',
      destination: 'Mumbai Warehouse',
      routeCode: 'RT-KOL-MUM-001',
      distance: 2050,
      estimatedTime: 36,
      scheduledDeparture: '2024-10-22 06:00',
      actualDeparture: '2024-10-22 06:45',
      estimatedArrival: '2024-10-23 18:00',
      actualArrival: null,
      shipments: 22,
      totalWeight: 28000,
      priority: 'normal',
      status: 'delayed',
      currentLocation: 'Bhubaneswar Hub',
      completionPercentage: 25,
      dispatchedBy: 'Amit Patel',
      remarks: 'Delayed due to weather',
      fuelCost: 52000,
      tollCost: 12000
    },
    {
      id: 4,
      dispatchId: 'DSP-2024-004',
      loadId: 'LD-2024-004',
      vehicleNumber: 'TS-09-GH-3456',
      driverName: 'Prakash Reddy',
      driverPhone: '+91-9876543213',
      origin: 'Hyderabad Factory',
      destination: 'Bangalore Plant',
      routeCode: 'RT-HYD-BLR-001',
      distance: 575,
      estimatedTime: 10,
      scheduledDeparture: '2024-10-21 14:00',
      actualDeparture: '2024-10-21 14:00',
      estimatedArrival: '2024-10-22 00:00',
      actualArrival: '2024-10-21 23:45',
      shipments: 12,
      totalWeight: 11500,
      priority: 'high',
      status: 'arrived',
      currentLocation: 'Bangalore Plant',
      completionPercentage: 100,
      dispatchedBy: 'Vikram Malhotra',
      remarks: 'Delivered successfully',
      fuelCost: 14000,
      tollCost: 3000
    },
    {
      id: 5,
      dispatchId: 'DSP-2024-005',
      loadId: 'LD-2024-005',
      vehicleNumber: 'MH-12-IJ-7890',
      driverName: 'Ganesh Patil',
      driverPhone: '+91-9876543214',
      origin: 'Pune Hub',
      destination: 'Goa Distribution',
      routeCode: 'RT-PUN-GOA-001',
      distance: 485,
      estimatedTime: 9,
      scheduledDeparture: '2024-10-24 10:00',
      actualDeparture: null,
      estimatedArrival: '2024-10-24 19:00',
      actualArrival: null,
      shipments: 6,
      totalWeight: 4500,
      priority: 'low',
      status: 'scheduled',
      currentLocation: 'Pune Hub',
      completionPercentage: 0,
      dispatchedBy: 'Sunita Desai',
      remarks: 'Scheduled for tomorrow',
      fuelCost: 12000,
      tollCost: 3200
    },
    {
      id: 6,
      dispatchId: 'DSP-2024-006',
      loadId: 'LD-2024-006',
      vehicleNumber: 'DL-03-KL-2468',
      driverName: 'Vijay Singh',
      driverPhone: '+91-9876543215',
      origin: 'Delhi Distribution Center',
      destination: 'Jammu Depot',
      routeCode: 'RT-DEL-JAM-001',
      distance: 585,
      estimatedTime: 11,
      scheduledDeparture: '2024-10-22 22:00',
      actualDeparture: '2024-10-22 22:15',
      estimatedArrival: '2024-10-23 09:00',
      actualArrival: null,
      shipments: 10,
      totalWeight: 14000,
      priority: 'normal',
      status: 'departed',
      currentLocation: 'Delhi Distribution Center',
      completionPercentage: 5,
      dispatchedBy: 'Rajesh Kumar',
      remarks: 'Just departed',
      fuelCost: 15000,
      tollCost: 3500
    },
    {
      id: 7,
      dispatchId: 'DSP-2024-007',
      loadId: 'LD-2024-007',
      vehicleNumber: 'TN-01-MN-1357',
      driverName: 'Murugan Subramanian',
      driverPhone: '+91-9876543216',
      origin: 'Chennai Port',
      destination: 'Kochi Depot',
      routeCode: 'RT-CHN-KOC-001',
      distance: 695,
      estimatedTime: 12,
      scheduledDeparture: '2024-10-23 16:00',
      actualDeparture: null,
      estimatedArrival: '2024-10-24 04:00',
      actualArrival: null,
      shipments: 14,
      totalWeight: 16800,
      priority: 'high',
      status: 'scheduled',
      currentLocation: 'Chennai Port',
      completionPercentage: 0,
      dispatchedBy: 'Priya Singh',
      remarks: 'Awaiting departure',
      fuelCost: 17000,
      tollCost: 4000
    },
    {
      id: 8,
      dispatchId: 'DSP-2024-008',
      loadId: 'LD-2024-008',
      vehicleNumber: 'GJ-01-OP-2580',
      driverName: 'Bharat Patel',
      driverPhone: '+91-9876543217',
      origin: 'Ahmedabad Factory',
      destination: 'Mumbai Warehouse',
      routeCode: 'RT-AHM-MUM-001',
      distance: 535,
      estimatedTime: 9,
      scheduledDeparture: '2024-10-21 20:00',
      actualDeparture: '2024-10-21 20:00',
      estimatedArrival: '2024-10-22 05:00',
      actualArrival: '2024-10-22 04:50',
      shipments: 9,
      totalWeight: 7200,
      priority: 'normal',
      status: 'arrived',
      currentLocation: 'Mumbai Warehouse',
      completionPercentage: 100,
      dispatchedBy: 'Amit Patel',
      remarks: 'Early delivery',
      fuelCost: 13000,
      tollCost: 3500
    },
    {
      id: 9,
      dispatchId: 'DSP-2024-009',
      loadId: 'LD-2024-009',
      vehicleNumber: 'MH-01-QR-3691',
      driverName: 'Ashok Jadhav',
      driverPhone: '+91-9876543218',
      origin: 'Mumbai Warehouse',
      destination: 'Pune Hub',
      routeCode: 'RT-MUM-PUN-001',
      distance: 150,
      estimatedTime: 3,
      scheduledDeparture: '2024-10-22 14:00',
      actualDeparture: null,
      estimatedArrival: '2024-10-22 17:00',
      actualArrival: null,
      shipments: 5,
      totalWeight: 3200,
      priority: 'low',
      status: 'cancelled',
      currentLocation: 'Mumbai Warehouse',
      completionPercentage: 0,
      dispatchedBy: 'Rajesh Kumar',
      remarks: 'Cancelled due to client request',
      fuelCost: 4000,
      tollCost: 800
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'scheduled': 'text-blue-600 bg-blue-50 border-blue-200',
      'departed': 'text-purple-600 bg-purple-50 border-purple-200',
      'in-transit': 'text-green-600 bg-green-50 border-green-200',
      'delayed': 'text-orange-600 bg-orange-50 border-orange-200',
      'arrived': 'text-gray-600 bg-gray-50 border-gray-200',
      'cancelled': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'urgent': 'text-red-600 bg-red-50 border-red-200',
      'high': 'text-orange-600 bg-orange-50 border-orange-200',
      'normal': 'text-blue-600 bg-blue-50 border-blue-200',
      'low': 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'arrived':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const totalDispatches = dispatches.length;
  const inTransit = dispatches.filter(d => d.status === 'in-transit' || d.status === 'departed').length;
  const onTimeDeliveries = dispatches.filter(d => d.status === 'arrived' && d.actualArrival && d.actualArrival <= d.estimatedArrival).length;
  const totalArrived = dispatches.filter(d => d.status === 'arrived').length;
  const onTimePercentage = totalArrived > 0 ? ((onTimeDeliveries / totalArrived) * 100).toFixed(1) : '0';

  const filteredDispatches = dispatches.filter(dispatch => {
    const matchesSearch = dispatch.dispatchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispatch.loadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispatch.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispatch.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || dispatch.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || dispatch.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Send className="w-8 h-8 text-purple-600" />
            <span>Dispatch Management</span>
          </h1>
          <p className="text-gray-600 mt-1">Track and manage vehicle dispatches and deliveries</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Dispatch</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Send className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{totalDispatches}</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Total Dispatches</div>
          <div className="text-xs text-purple-600 mt-1">Active & Completed</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{inTransit}</span>
          </div>
          <div className="text-sm font-medium text-green-700">In Transit</div>
          <div className="text-xs text-green-600 mt-1">Currently Moving</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{onTimePercentage}%</span>
          </div>
          <div className="text-sm font-medium text-blue-700">On-Time Delivery</div>
          <div className="text-xs text-blue-600 mt-1">Performance Rate</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{dispatches.filter(d => d.status === 'delayed').length}</span>
          </div>
          <div className="text-sm font-medium text-orange-700">Delayed</div>
          <div className="text-xs text-orange-600 mt-1">Requires Attention</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dispatches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="departed">Departed</option>
            <option value="in-transit">In Transit</option>
            <option value="delayed">Delayed</option>
            <option value="arrived">Arrived</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispatch Details</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle & Driver</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDispatches.map((dispatch) => (
                <tr key={dispatch.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="font-medium text-gray-900">{dispatch.dispatchId}</div>
                    <div className="text-sm text-gray-600">Load: {dispatch.loadId}</div>
                    <div className="text-xs text-gray-500 mt-1">{dispatch.shipments} shipments • {(dispatch.totalWeight / 1000).toFixed(1)}T</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span>{dispatch.vehicleNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{dispatch.driverName}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{dispatch.driverPhone}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm text-gray-900">{dispatch.origin}</div>
                    <div className="text-sm text-gray-600">→ {dispatch.destination}</div>
                    <div className="text-xs text-gray-500 mt-1">{dispatch.routeCode} • {dispatch.distance}km</div>
                  </td>
                  <td className="px-3 py-2 text-sm">
                    <div className="flex items-center space-x-1 text-gray-900">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{new Date(dispatch.scheduledDeparture).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{new Date(dispatch.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {dispatch.actualDeparture && (
                      <div className="text-xs text-green-600 mt-1">
                        Departed: {new Date(dispatch.actualDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{dispatch.currentLocation}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div
                          className="h-2 rounded-full bg-purple-500"
                          style={{ width: `${dispatch.completionPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-purple-900">
                        {dispatch.completionPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(dispatch.priority)}`}>
                      {dispatch.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(dispatch.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(dispatch.status)}`}>
                        {dispatch.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Dispatch Process</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Manage the complete dispatch lifecycle from scheduling to delivery confirmation.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Schedule dispatches with load assignments</div>
            <div>• Track real-time vehicle locations</div>
            <div>• Monitor delivery progress and ETAs</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Vehicle & Driver Tracking</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Monitor vehicle assignments, driver details, and real-time location updates.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Vehicle allocation and availability</div>
            <div>• Driver contact information</div>
            <div>• GPS tracking and route adherence</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Exception Management</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Handle delays, route deviations, and delivery exceptions proactively.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Real-time delay notifications</div>
            <div>• Route deviation alerts</div>
            <div>• Alternate route recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
