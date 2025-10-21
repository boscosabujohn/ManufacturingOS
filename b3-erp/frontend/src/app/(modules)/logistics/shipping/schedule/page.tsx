'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Plus, Truck, Package, MapPin, Clock, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface ScheduledShipment {
  id: string;
  date: string;
  shipmentNo: string;
  type: 'inbound' | 'outbound';
  customer: string;
  origin: string;
  destination: string;
  timeSlot: string;
  vehicleNo: string;
  driverName: string;
  items: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  bay: string;
  priority: 'high' | 'medium' | 'low';
}

export default function ShippingSchedulePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('2025-10-21');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const scheduledShipments: ScheduledShipment[] = [
    {
      id: '1',
      date: '2025-10-21',
      shipmentNo: 'OB-2025-0531',
      type: 'outbound',
      customer: 'Precision Engineering Co',
      origin: 'Warehouse A',
      destination: 'Bangalore',
      timeSlot: '08:00 - 10:00',
      vehicleNo: 'TN-01-AB-1234',
      driverName: 'Rajesh Kumar',
      items: 8,
      status: 'in-progress',
      bay: 'BAY-01',
      priority: 'high'
    },
    {
      id: '2',
      date: '2025-10-21',
      shipmentNo: 'IB-2025-0421',
      type: 'inbound',
      customer: 'SteelCorp Industries',
      origin: 'Mumbai',
      destination: 'Warehouse A',
      timeSlot: '10:00 - 12:00',
      vehicleNo: 'MH-02-CD-5678',
      driverName: 'Amit Patel',
      items: 5,
      status: 'scheduled',
      bay: 'BAY-03',
      priority: 'high'
    },
    {
      id: '3',
      date: '2025-10-21',
      shipmentNo: 'OB-2025-0536',
      type: 'outbound',
      customer: 'Machinery Supplies Co',
      origin: 'Warehouse A',
      destination: 'Kochi',
      timeSlot: '09:00 - 11:00',
      vehicleNo: 'TN-06-KL-2345',
      driverName: 'Mohammed Ali',
      items: 7,
      status: 'in-progress',
      bay: 'BAY-02',
      priority: 'high'
    },
    {
      id: '4',
      date: '2025-10-21',
      shipmentNo: 'IB-2025-0424',
      type: 'inbound',
      customer: 'ChemSupply Co',
      origin: 'Ahmedabad',
      destination: 'Warehouse A',
      timeSlot: '14:00 - 16:00',
      vehicleNo: 'GJ-01-EF-9012',
      driverName: 'Kiran Shah',
      items: 4,
      status: 'confirmed',
      bay: 'BAY-04',
      priority: 'medium'
    },
    {
      id: '5',
      date: '2025-10-22',
      shipmentNo: 'OB-2025-0532',
      type: 'outbound',
      customer: 'Industrial Solutions Ltd',
      origin: 'Warehouse A',
      destination: 'Hyderabad',
      timeSlot: '08:00 - 10:00',
      vehicleNo: 'TN-02-CD-5678',
      driverName: 'Suresh Reddy',
      items: 5,
      status: 'scheduled',
      bay: 'BAY-01',
      priority: 'high'
    },
    {
      id: '6',
      date: '2025-10-22',
      shipmentNo: 'IB-2025-0422',
      type: 'inbound',
      customer: 'BearingTech Industries',
      origin: 'Pune',
      destination: 'Warehouse A',
      timeSlot: '11:00 - 13:00',
      vehicleNo: 'MH-12-GH-3456',
      driverName: 'Prakash Joshi',
      items: 3,
      status: 'delayed',
      bay: 'BAY-02',
      priority: 'high'
    },
    {
      id: '7',
      date: '2025-10-23',
      shipmentNo: 'OB-2025-0533',
      type: 'outbound',
      customer: 'Manufacturing Hub Inc',
      origin: 'Warehouse B',
      destination: 'Mumbai',
      timeSlot: '07:00 - 09:00',
      vehicleNo: 'TN-03-EF-9012',
      driverName: 'Arun Sharma',
      items: 12,
      status: 'scheduled',
      bay: 'BAY-01',
      priority: 'medium'
    },
    {
      id: '8',
      date: '2025-10-23',
      shipmentNo: 'IB-2025-0423',
      type: 'inbound',
      customer: 'MetalSource Ltd',
      origin: 'Bangalore',
      destination: 'Warehouse B',
      timeSlot: '09:00 - 11:00',
      vehicleNo: 'KA-01-IJ-7890',
      driverName: 'Venkat Raman',
      items: 8,
      status: 'confirmed',
      bay: 'BAY-03',
      priority: 'medium'
    }
  ];

  const filteredShipments = scheduledShipments.filter(shipment => {
    const matchesDate = shipment.date === selectedDate;
    const matchesType = filterType === 'all' || shipment.type === filterType;
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    return matchesDate && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    return type === 'inbound' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'confirmed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'delayed': return 'bg-red-100 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'in-progress': return <Truck className="w-3 h-3" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'scheduled': return <Clock className="w-3 h-3" />;
      case 'delayed': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getShipmentsByDate = (date: string) => {
    return scheduledShipments.filter(s => s.date === date);
  };

  const getUpcomingDates = () => {
    const dates = ['2025-10-21', '2025-10-22', '2025-10-23', '2025-10-24', '2025-10-25'];
    return dates;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipping Schedule</h1>
            <p className="text-sm text-gray-500 mt-1">Plan and manage inbound and outbound shipment schedules</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Schedule</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Today's Inbound</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {scheduledShipments.filter(s => s.date === selectedDate && s.type === 'inbound').length}
              </p>
            </div>
            <Package className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Today's Outbound</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {scheduledShipments.filter(s => s.date === selectedDate && s.type === 'outbound').length}
              </p>
            </div>
            <Truck className="w-6 h-6 text-green-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">In Progress</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {scheduledShipments.filter(s => s.status === 'in-progress').length}
              </p>
            </div>
            <Truck className="w-6 h-6 text-purple-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Delayed</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {scheduledShipments.filter(s => s.status === 'delayed').length}
              </p>
            </div>
            <AlertCircle className="w-6 h-6 text-red-700" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Overview
            </h3>
            <div className="space-y-2">
              {getUpcomingDates().map((date) => {
                const shipments = getShipmentsByDate(date);
                const isSelected = date === selectedDate;
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isSelected ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {shipments.length} shipment{shipments.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          {shipments.filter(s => s.type === 'inbound').length}
                        </span>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          {shipments.filter(s => s.type === 'outbound').length}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="inbound">Inbound</option>
                  <option value="outbound">Outbound</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredShipments.map((shipment) => (
                <div key={shipment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${shipment.type === 'inbound' ? 'bg-blue-100' : 'bg-green-100'}`}>
                        {shipment.type === 'inbound' ? (
                          <Package className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Truck className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-900">{shipment.shipmentNo}</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getTypeColor(shipment.type)}`}>
                            {shipment.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{shipment.customer}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(shipment.priority)}`}>
                        {shipment.priority}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                        {getStatusIcon(shipment.status)}
                        {shipment.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">Time Slot</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <p className="font-semibold text-gray-900">{shipment.timeSlot}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Bay</p>
                      <p className="font-semibold text-purple-600">{shipment.bay}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Vehicle</p>
                      <p className="font-mono font-semibold text-gray-900">{shipment.vehicleNo}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Items</p>
                      <p className="font-semibold text-gray-900">{shipment.items} items</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700">{shipment.origin}</span>
                      <span className="text-gray-400">’</span>
                      <span className="font-semibold text-gray-900">{shipment.destination}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredShipments.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No shipments scheduled for this date</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Schedule Management:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Plan shipments in advance to optimize bay utilization and resource allocation</li>
          <li>Assign time slots to prevent congestion and ensure smooth operations</li>
          <li>Coordinate with carriers and drivers for timely arrivals</li>
          <li>Monitor schedule adherence and address delays proactively</li>
          <li>Balance inbound and outbound shipments for optimal warehouse operations</li>
        </ul>
      </div>
    </div>
  );
}
