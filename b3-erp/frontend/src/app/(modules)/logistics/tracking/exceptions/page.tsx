'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, AlertTriangle, XCircle, Clock, Package, Truck, MapPin, User, Calendar, Filter, CheckCircle, MessageSquare } from 'lucide-react';

interface TrackingException {
  id: string;
  exceptionNo: string;
  shipmentNo: string;
  trackingNumber: string;
  orderNo: string;
  customer: string;
  exceptionType: 'delivery-failed' | 'damaged' | 'lost' | 'delayed' | 'wrong-address' | 'refused' | 'weather' | 'customs';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  reportedDate: string;
  reportedBy: string;
  currentLocation: string;
  expectedDelivery: string;
  description: string;
  resolution: string;
  resolvedDate: string;
  resolvedBy: string;
  assignedTo: string;
  priority: 'urgent' | 'high' | 'normal';
  items: number;
  value: number;
  carrier: string;
  vehicleNo: string;
  comments: number;
}

export default function TrackingExceptionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const exceptions: TrackingException[] = [
    {
      id: '1',
      exceptionNo: 'EXC-2025-1001',
      shipmentNo: 'OB-2025-0537',
      trackingNumber: 'TRK-CHN-2025-4527',
      orderNo: 'SO-2025-1240',
      customer: 'Eastern Electronics',
      exceptionType: 'delivery-failed',
      severity: 'high',
      status: 'investigating',
      reportedDate: '2025-10-21 14:20',
      reportedBy: 'Delivery Agent - Ravi Das',
      currentLocation: 'Kolkata Distribution Center',
      expectedDelivery: '2025-10-21 16:00',
      description: 'Customer not available at delivery address. Premises locked. Multiple contact attempts failed.',
      resolution: '',
      resolvedDate: '',
      resolvedBy: '',
      assignedTo: 'Kolkata Logistics Team',
      priority: 'high',
      items: 7,
      value: 45000,
      carrier: 'Indian Post',
      vehicleNo: 'WB-01-KL-5678',
      comments: 3
    },
    {
      id: '2',
      exceptionNo: 'EXC-2025-1002',
      shipmentNo: 'OB-2025-0533',
      trackingNumber: 'TRK-CHN-2025-4523',
      orderNo: 'SO-2025-1236',
      customer: 'TechCorp Solutions',
      exceptionType: 'delayed',
      severity: 'medium',
      status: 'investigating',
      reportedDate: '2025-10-21 18:30',
      reportedBy: 'Transit Hub Manager - Pune',
      currentLocation: 'Pune Transit Hub',
      expectedDelivery: '2025-10-22 12:00',
      description: 'Vehicle breakdown during transit. Mechanical issues being resolved. Shipment will be transferred to alternate vehicle.',
      resolution: '',
      resolvedDate: '',
      resolvedBy: '',
      assignedTo: 'Fleet Maintenance Team',
      priority: 'urgent',
      items: 15,
      value: 125000,
      carrier: 'Indian Post',
      vehicleNo: 'MH-12-CD-3456',
      comments: 5
    },
    {
      id: '3',
      exceptionNo: 'EXC-2025-1003',
      shipmentNo: 'OB-2025-0544',
      trackingNumber: 'TRK-CHN-2025-4534',
      orderNo: 'SO-2025-1247',
      customer: 'Global Manufacturing',
      exceptionType: 'damaged',
      severity: 'critical',
      status: 'escalated',
      reportedDate: '2025-10-20 16:45',
      reportedBy: 'Warehouse QC - Mumbai',
      currentLocation: 'Mumbai Warehouse',
      expectedDelivery: '2025-10-21 10:00',
      description: 'Significant damage to 3 packages during transit. Outer cartons crushed. Internal product damage suspected. Customer notified.',
      resolution: '',
      resolvedDate: '',
      resolvedBy: '',
      assignedTo: 'Claims Department',
      priority: 'urgent',
      items: 12,
      value: 280000,
      carrier: 'DHL Express',
      vehicleNo: 'MH-01-EF-7890',
      comments: 8
    },
    {
      id: '4',
      exceptionNo: 'EXC-2025-1004',
      shipmentNo: 'OB-2025-0548',
      trackingNumber: 'TRK-CHN-2025-4538',
      orderNo: 'SO-2025-1251',
      customer: 'Precision Tools Ltd',
      exceptionType: 'wrong-address',
      severity: 'high',
      status: 'resolved',
      reportedDate: '2025-10-19 11:30',
      reportedBy: 'Delivery Agent - Vikram Singh',
      currentLocation: 'Customer Location - Corrected',
      expectedDelivery: '2025-10-19 15:00',
      description: 'Incorrect delivery address on shipping label. Customer provided updated address. Shipment rerouted successfully.',
      resolution: 'Address corrected in system. Delivery completed to correct location. Customer satisfied.',
      resolvedDate: '2025-10-19 13:45',
      resolvedBy: 'Operations Manager - Delhi',
      assignedTo: 'Delhi Delivery Team',
      priority: 'high',
      items: 16,
      value: 95000,
      carrier: 'Blue Dart Express',
      vehicleNo: 'UP-16-CD-2345',
      comments: 4
    },
    {
      id: '5',
      exceptionNo: 'EXC-2025-1005',
      shipmentNo: 'OB-2025-0551',
      trackingNumber: 'TRK-CHN-2025-4541',
      orderNo: 'SO-2025-1254',
      customer: 'Central Distributors',
      exceptionType: 'weather',
      severity: 'medium',
      status: 'open',
      reportedDate: '2025-10-18 08:00',
      reportedBy: 'Regional Manager - Central',
      currentLocation: 'Bhopal Transit Hub',
      expectedDelivery: '2025-10-18 18:00',
      description: 'Heavy rainfall and flooding in delivery route. Road access blocked. Waiting for weather to clear and alternate route assessment.',
      resolution: '',
      resolvedDate: '',
      resolvedBy: '',
      assignedTo: 'Route Planning Team',
      priority: 'normal',
      items: 22,
      value: 165000,
      carrier: 'DTDC Courier',
      vehicleNo: 'MP-09-GH-3456',
      comments: 2
    },
    {
      id: '6',
      exceptionNo: 'EXC-2025-1006',
      shipmentNo: 'OB-2025-0540',
      trackingNumber: 'TRK-CHN-2025-4530',
      orderNo: 'SO-2025-1243',
      customer: 'Coastal Enterprises',
      exceptionType: 'refused',
      severity: 'high',
      status: 'resolved',
      reportedDate: '2025-10-20 10:15',
      reportedBy: 'Delivery Agent - Prasad Kumar',
      currentLocation: 'Chennai Warehouse A - Returned',
      expectedDelivery: '2025-10-20 14:00',
      description: 'Customer refused delivery citing order cancellation. No prior notification received. Shipment returned to origin warehouse.',
      resolution: 'Shipment returned to warehouse. Customer service contacted client. Order cancelled. Return processing initiated.',
      resolvedDate: '2025-10-21 11:45',
      resolvedBy: 'Customer Service Manager',
      assignedTo: 'Returns Department',
      priority: 'normal',
      items: 9,
      value: 58000,
      carrier: 'FedEx',
      vehicleNo: 'AP-01-GH-4567',
      comments: 6
    },
    {
      id: '7',
      exceptionNo: 'EXC-2025-1007',
      shipmentNo: 'OB-2025-0559',
      trackingNumber: 'TRK-CHN-2025-4549',
      orderNo: 'SO-2025-1262',
      customer: 'International Imports Inc',
      exceptionType: 'customs',
      severity: 'critical',
      status: 'investigating',
      reportedDate: '2025-10-17 14:30',
      reportedBy: 'Customs Broker',
      currentLocation: 'Chennai Port - Customs Hold',
      expectedDelivery: '2025-10-20 12:00',
      description: 'Shipment held at customs for documentation verification. Missing import license certificate. Customer contacted for documents.',
      resolution: '',
      resolvedDate: '',
      resolvedBy: '',
      assignedTo: 'Customs Clearance Team',
      priority: 'urgent',
      items: 25,
      value: 450000,
      carrier: 'International Freight',
      vehicleNo: 'N/A',
      comments: 12
    },
    {
      id: '8',
      exceptionNo: 'EXC-2025-1008',
      shipmentNo: 'OB-2025-0562',
      trackingNumber: 'TRK-CHN-2025-4552',
      orderNo: 'SO-2025-1265',
      customer: 'Northern Traders',
      exceptionType: 'lost',
      severity: 'critical',
      status: 'escalated',
      reportedDate: '2025-10-16 09:00',
      reportedBy: 'Hub Manager - Jaipur',
      currentLocation: 'Last seen: Delhi Transit Hub',
      expectedDelivery: '2025-10-18 16:00',
      description: 'Shipment cannot be located. Last scanned at Delhi hub on 2025-10-15. Not arrived at Jaipur destination. Investigation in progress.',
      resolution: '',
      resolvedDate: '',
      resolvedBy: '',
      assignedTo: 'Loss Prevention Team',
      priority: 'urgent',
      items: 18,
      value: 320000,
      carrier: 'Blue Dart Express',
      vehicleNo: 'DL-01-IJ-5678',
      comments: 15
    },
    {
      id: '9',
      exceptionNo: 'EXC-2025-1009',
      shipmentNo: 'OB-2025-0565',
      trackingNumber: 'TRK-CHN-2025-4555',
      orderNo: 'SO-2025-1268',
      customer: 'Tech Innovations Pvt Ltd',
      exceptionType: 'delivery-failed',
      severity: 'medium',
      status: 'resolved',
      reportedDate: '2025-10-15 17:00',
      reportedBy: 'Delivery Agent - Anil Kumar',
      currentLocation: 'Delivered Successfully',
      expectedDelivery: '2025-10-15 14:00',
      description: 'Security at customer premises refused entry. No delivery authorization on file. Contacted customer directly.',
      resolution: 'Customer provided authorization. Delivery completed successfully on second attempt next day.',
      resolvedDate: '2025-10-16 11:30',
      resolvedBy: 'Delivery Supervisor',
      assignedTo: 'Bangalore Delivery Team',
      priority: 'normal',
      items: 11,
      value: 72000,
      carrier: 'DTDC Courier',
      vehicleNo: 'KA-01-JK-6789',
      comments: 3
    },
    {
      id: '10',
      exceptionNo: 'EXC-2025-1010',
      shipmentNo: 'OB-2025-0568',
      trackingNumber: 'TRK-CHN-2025-4558',
      orderNo: 'SO-2025-1271',
      customer: 'Metro Wholesale',
      exceptionType: 'delayed',
      severity: 'low',
      status: 'resolved',
      reportedDate: '2025-10-14 12:00',
      reportedBy: 'Route Manager',
      currentLocation: 'Delivered',
      expectedDelivery: '2025-10-14 10:00',
      description: 'Minor traffic delay due to road construction. Estimated 2-hour delay in delivery schedule.',
      resolution: 'Delivery completed with 1.5 hour delay. Customer informed and accepted delayed delivery.',
      resolvedDate: '2025-10-14 11:30',
      resolvedBy: 'Delivery Agent',
      assignedTo: 'Coimbatore Team',
      priority: 'normal',
      items: 8,
      value: 34000,
      carrier: 'Indian Post',
      vehicleNo: 'TN-37-LM-7890',
      comments: 1
    }
  ];

  const exceptionStats = {
    total: exceptions.length,
    open: exceptions.filter(e => e.status === 'open').length,
    investigating: exceptions.filter(e => e.status === 'investigating').length,
    resolved: exceptions.filter(e => e.status === 'resolved').length,
    escalated: exceptions.filter(e => e.status === 'escalated').length,
    critical: exceptions.filter(e => e.severity === 'critical').length,
    high: exceptions.filter(e => e.severity === 'high').length,
    avgResolutionTime: '4.2 hours'
  };

  const filteredExceptions = exceptions.filter(exception => {
    const matchesSearch =
      exception.exceptionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.shipmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || exception.exceptionType === typeFilter;
    const matchesStatus = statusFilter === 'all' || exception.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || exception.severity === severityFilter;

    return matchesSearch && matchesType && matchesStatus && matchesSeverity;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'delivery-failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'damaged': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'lost': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delayed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'wrong-address': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'refused': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'weather': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'customs': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'investigating': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'open': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'escalated': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delivery-failed': return <XCircle className="w-5 h-5" />;
      case 'damaged': return <AlertTriangle className="w-5 h-5" />;
      case 'lost': return <Package className="w-5 h-5" />;
      case 'delayed': return <Clock className="w-5 h-5" />;
      case 'wrong-address': return <MapPin className="w-5 h-5" />;
      case 'refused': return <User className="w-5 h-5" />;
      case 'weather': return <AlertTriangle className="w-5 h-5" />;
      case 'customs': return <Truck className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tracking Exceptions</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and resolve shipment exceptions and issues</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{exceptionStats.total}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Exceptions</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{exceptionStats.open}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Open</p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Search className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{exceptionStats.investigating}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Investigating</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{exceptionStats.resolved}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Resolved</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{exceptionStats.escalated}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Escalated</p>
        </div>

        <div className="bg-gradient-to-br from-red-400 to-red-500 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{exceptionStats.critical}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Critical</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{exceptionStats.high}</span>
          </div>
          <p className="text-xs font-medium opacity-90">High Severity</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-7 h-7 opacity-80" />
            <span className="text-xl font-bold">{exceptionStats.avgResolutionTime}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Avg Resolution</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by exception no, shipment no, tracking number, customer, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="delivery-failed">Delivery Failed</option>
              <option value="damaged">Damaged</option>
              <option value="lost">Lost</option>
              <option value="delayed">Delayed</option>
              <option value="wrong-address">Wrong Address</option>
              <option value="refused">Refused</option>
              <option value="weather">Weather</option>
              <option value="customs">Customs</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredExceptions.length} of {exceptionStats.total} exceptions</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredExceptions.map((exception) => (
          <div key={exception.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`mt-1 p-2 rounded-lg border ${getTypeColor(exception.exceptionType)}`}>
                  {getTypeIcon(exception.exceptionType)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{exception.exceptionNo}</h3>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(exception.status)}`}>
                      {exception.status}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(exception.severity)}`}>
                      {exception.severity}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(exception.exceptionType)}`}>
                      {exception.exceptionType.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-mono">{exception.shipmentNo}</span>
                    <span className="font-mono text-blue-600">{exception.trackingNumber}</span>
                    <span>{exception.customer}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Shipment Value</p>
                <p className="text-lg font-bold text-gray-900">¹{exception.value.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 font-medium mb-1">Reported</p>
                    <p className="text-sm font-semibold text-blue-900">{exception.reportedDate}</p>
                    <p className="text-xs text-blue-700 mt-0.5">By: {exception.reportedBy}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-purple-600 font-medium mb-1">Current Location</p>
                    <p className="text-sm font-semibold text-purple-900">{exception.currentLocation}</p>
                    <p className="text-xs text-purple-700 mt-0.5">Carrier: {exception.carrier}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-orange-600 font-medium mb-1">Assigned To</p>
                    <p className="text-sm font-semibold text-orange-900">{exception.assignedTo}</p>
                    <p className="text-xs text-orange-700 mt-0.5">Priority: {exception.priority}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Exception Description</p>
              <p className="text-sm text-gray-900">{exception.description}</p>
            </div>

            {exception.resolution && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-green-600 font-medium mb-1">Resolution</p>
                    <p className="text-sm text-green-900">{exception.resolution}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-green-200 text-xs text-green-700">
                  <span className="font-medium">Resolved by:</span> {exception.resolvedBy} on {exception.resolvedDate}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{exception.items} items</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>{exception.vehicleNo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{exception.comments} comments</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  View Details
                </button>
                {exception.status !== 'resolved' && (
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm">
                    Update Status
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExceptions.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No exceptions found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Exception Types Guide:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <span className="font-medium">Delivery Failed:</span>
            <span>Recipient unavailable or inaccessible</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Damaged:</span>
            <span>Package damage during transit or handling</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Lost:</span>
            <span>Shipment cannot be located in system</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Delayed:</span>
            <span>Behind schedule due to operational issues</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Wrong Address:</span>
            <span>Incorrect or incomplete delivery address</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Refused:</span>
            <span>Customer declined to accept delivery</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Weather:</span>
            <span>Delayed due to adverse weather conditions</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Customs:</span>
            <span>Held at customs for clearance or documentation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
