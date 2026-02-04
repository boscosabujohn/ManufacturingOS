'use client';

import React from 'react';
import { AlertTriangle, Clock, Truck, MapPin, CheckCircle } from 'lucide-react';

export type ExceptionType = 'delay' | 'damage' | 'lost' | 'temperature' | 'route-deviation' | 'accident';
export type ExceptionSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Exception {
  id: string;
  shipmentId: string;
  type: ExceptionType;
  severity: ExceptionSeverity;
  description: string;
  location: string;
  timestamp: string;
  status: 'open' | 'acknowledged' | 'resolved';
  assignedTo?: string;
  resolution?: string;
}

export default function ExceptionHandling() {
  const exceptions: Exception[] = [
    {
      id: 'EXC-001',
      shipmentId: 'SH-2025-0125',
      type: 'delay',
      severity: 'high',
      description: 'Vehicle breakdown on NH-44, ETA delayed by 3 hours',
      location: 'Chennai Outer Ring Road',
      timestamp: '2025-01-24 15:30',
      status: 'acknowledged',
      assignedTo: 'Operations Manager',
    },
    {
      id: 'EXC-002',
      shipmentId: 'SH-2025-0122',
      type: 'temperature',
      severity: 'critical',
      description: 'Cold chain breach detected - temperature exceeded 25°C',
      location: 'Nagpur Transit Hub',
      timestamp: '2025-01-24 12:15',
      status: 'open',
    },
    {
      id: 'EXC-003',
      shipmentId: 'SH-2025-0120',
      type: 'damage',
      severity: 'medium',
      description: 'Minor packaging damage reported during loading',
      location: 'Mumbai Warehouse',
      timestamp: '2025-01-24 08:45',
      status: 'resolved',
      assignedTo: 'Warehouse Supervisor',
      resolution: 'Repackaged and dispatched',
    },
  ];

  const getSeverityColor = (severity: ExceptionSeverity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 p-3">
      <div className="">
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exception Handling & Alerts</h1>
          <p className="text-gray-600">Real-time exception monitoring and resolution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <div className="bg-white rounded-xl shadow-lg p-3 border border-red-200">
            <p className="text-sm text-gray-600 mb-1">Open Exceptions</p>
            <p className="text-3xl font-bold text-red-600">{exceptions.filter(e => e.status === 'open').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Critical</p>
            <p className="text-3xl font-bold text-orange-600">{exceptions.filter(e => e.severity === 'critical').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Acknowledged</p>
            <p className="text-3xl font-bold text-blue-600">{exceptions.filter(e => e.status === 'acknowledged').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Resolved Today</p>
            <p className="text-3xl font-bold text-green-600">{exceptions.filter(e => e.status === 'resolved').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Active Exceptions</h2>

          <div className="space-y-2">
            {exceptions.map((exception) => (
              <div key={exception.id} className={`rounded-lg p-3 border-2 ${getSeverityColor(exception.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{exception.type.toUpperCase().replace('-', ' ')}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(exception.severity)}`}>
                          {exception.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Shipment: {exception.shipmentId}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(exception.status)}`}>
                    {exception.status.toUpperCase().replace('-', ' ')}
                  </span>
                </div>

                <p className="text-gray-900 mb-3">{exception.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {exception.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    {exception.timestamp}
                  </div>
                  {exception.assignedTo && (
                    <div className="text-gray-600">
                      Assigned: {exception.assignedTo}
                    </div>
                  )}
                </div>

                {exception.resolution && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                    <p className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <strong>Resolution:</strong> {exception.resolution}
                    </p>
                  </div>
                )}

                {exception.status !== 'resolved' && (
                  <div className="flex gap-2 mt-3">
                    {exception.status === 'open' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        Acknowledge
                      </button>
                    )}
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Resolve
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                      Escalate
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
